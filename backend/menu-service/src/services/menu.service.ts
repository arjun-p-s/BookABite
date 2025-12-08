import { MenuItem, IMenuItem } from '../models/MenuItem.model';
// import { FoodItemService, FoodItem } from './fooditem.service'; // Commented out - implement when FoodItem service is ready
import { CacheService } from '../cache/redis.service';
import { EventPublisher } from '../events/publisher';
import { Logger } from '../observability/logger';
// import { CircuitBreaker } from '../resilience/circuit-breaker'; // Commented out - not needed yet
import { AppError } from '../utils/errors';

/**
 * DTO for creating a menu item
 */
export interface CreateMenuItemDTO {
    restaurantId: string;
    foodItemId: string;
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    images?: string[];
    available?: boolean;
    variants?: Array<{
        variantId: string;
        name: string;
        priceDelta: number;
    }>;
    addons?: Array<{
        addonId: string;
        name: string;
        price: number;
    }>;
    metadata?: Record<string, any>;
}

/**
 * DTO for updating a menu item
 */
export interface UpdateMenuItemDTO {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    images?: string[];
    available?: boolean;
    variants?: Array<{
        variantId: string;
        name: string;
        priceDelta: number;
    }>;
    addons?: Array<{
        addonId: string;
        name: string;
        price: number;
    }>;
    metadata?: Record<string, any>;
}

/**
 * Query options for listing menu items
 */
export interface MenuQueryOptions {
    restaurantId: string;
    availableOnly?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

/**
 * Menu Service - Business logic for menu management
 */
export class MenuService {
    private logger = Logger.getInstance();
    private cache = CacheService.getInstance();
    private eventPublisher = EventPublisher.getInstance();
    // private foodItemService = new FoodItemService(); // Commented out - implement when ready
    // private foodItemCircuitBreaker = new CircuitBreaker('FoodItemService', {
    //     failureThreshold: 5,
    //     resetTimeout: 60000,
    // });

    /**
     * Create a new menu item
     */
    async createMenuItem(
        dto: CreateMenuItemDTO,
        userId: string
    ): Promise<IMenuItem> {
        this.logger.info('Creating menu item', {
            restaurantId: dto.restaurantId,
            foodItemId: dto.foodItemId,
            userId,
        });

        try {
            // TODO: Validate FoodItem exists via FoodItem Service when it's implemented
            // const foodItem = await this.foodItemCircuitBreaker.execute(() =>
            //     this.foodItemService.getFoodItem(dto.foodItemId)
            // );

            // if (!foodItem) {
            //     throw new AppError(
            //         `FoodItem ${dto.foodItemId} not found`,
            //         404,
            //         'FOOD_ITEM_NOT_FOUND'
            //     );
            // }

            // Check for duplicate
            const existing = await MenuItem.findOne({
                restaurantId: dto.restaurantId,
                foodItemId: dto.foodItemId,
            });

            if (existing) {
                throw new AppError(
                    'Menu item already exists for this restaurant',
                    409,
                    'DUPLICATE_MENU_ITEM'
                );
            }

            // Create menu item with provided data
            const menuItem = new MenuItem({
                restaurantId: dto.restaurantId,
                foodItemId: dto.foodItemId,
                title: dto.title || 'Menu Item',
                description: dto.description || '',
                price: dto.price !== undefined ? dto.price : 0,
                currency: dto.currency || 'USD',
                images: dto.images || [],
                available: dto.available !== undefined ? dto.available : true,
                variants: dto.variants || [],
                addons: dto.addons || [],
                metadata: dto.metadata || {},
            });

            await menuItem.save();

            // Invalidate cache
            await this.invalidateMenuCache(dto.restaurantId);

            // Publish event
            await this.eventPublisher.publishMenuItemCreated(menuItem);

            this.logger.info('Menu item created successfully', {
                menuItemId: menuItem._id,
                restaurantId: dto.restaurantId,
            });

            return menuItem;
        } catch (error) {
            this.logger.error('Failed to create menu item', {
                error,
                dto,
            });
            throw error;
        }
    }

    /**
     * Get menu items for a restaurant
     */
    async getRestaurantMenu(
        options: MenuQueryOptions
    ): Promise<{ items: IMenuItem[]; total: number; page: number; pages: number }> {
        const {
            restaurantId,
            availableOnly = false,
            page = 1,
            limit = 50,
            sortBy = 'title',
            sortOrder = 'asc',
            search,
        } = options;

        // Check cache first
        const cacheKey = this.getMenuCacheKey(restaurantId, availableOnly);
        const cached = await this.cache.get<IMenuItem[]>(cacheKey);

        if (cached && !search) {
            this.logger.debug('Cache hit for restaurant menu', { restaurantId });
            return this.paginateResults(cached, page, limit);
        }

        // Query database
        let query: any = { restaurantId };
        if (availableOnly) {
            query.available = true;
        }

        let items: IMenuItem[];

        if (search) {
            items = await MenuItem.searchMenu(restaurantId, search);
        } else {
            const sortOptions: any = {};
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
            items = await MenuItem.find(query).sort(sortOptions);
        }

        // Cache the results
        if (!search) {
            await this.cache.set(cacheKey, items, 300); // 5 minutes TTL
        }

        return this.paginateResults(items, page, limit);
    }

    /**
     * Get a single menu item by ID
     */
    async getMenuItem(menuItemId: string): Promise<IMenuItem | null> {
        const cacheKey = `menu:item:${menuItemId}`;
        const cached = await this.cache.get<IMenuItem>(cacheKey);

        if (cached) {
            return cached;
        }

        const menuItem = await MenuItem.findById(menuItemId);

        if (menuItem) {
            await this.cache.set(cacheKey, menuItem, 300);
        }

        return menuItem;
    }

    /**
     * Update a menu item
     */
    async updateMenuItem(
        menuItemId: string,
        dto: UpdateMenuItemDTO,
        userId: string,
        version?: number
    ): Promise<IMenuItem> {
        this.logger.info('Updating menu item', { menuItemId, userId });

        const menuItem = await MenuItem.findById(menuItemId);

        if (!menuItem) {
            throw new AppError('Menu item not found', 404, 'MENU_ITEM_NOT_FOUND');
        }

        // Optimistic locking check
        if (version !== undefined && menuItem.version !== version) {
            throw new AppError(
                'Menu item has been modified by another user',
                409,
                'OPTIMISTIC_LOCK_CONFLICT'
            );
        }

        // Track which fields are being overridden
        const overriddenFields = menuItem.source?.overriddenFields || [];

        if (dto.title !== undefined && dto.title !== menuItem.title) {
            menuItem.title = dto.title;
            if (!overriddenFields.includes('title')) {
                overriddenFields.push('title');
            }
        }

        if (dto.description !== undefined) {
            menuItem.description = dto.description;
            if (!overriddenFields.includes('description')) {
                overriddenFields.push('description');
            }
        }

        if (dto.price !== undefined) {
            menuItem.price = dto.price;
            if (!overriddenFields.includes('price')) {
                overriddenFields.push('price');
            }
        }

        if (dto.currency !== undefined) {
            menuItem.currency = dto.currency;
        }

        if (dto.images !== undefined) {
            menuItem.images = dto.images;
        }

        if (dto.available !== undefined) {
            const availabilityChanged = menuItem.available !== dto.available;
            menuItem.available = dto.available;

            if (availabilityChanged) {
                // Publish availability changed event
                await this.eventPublisher.publishMenuItemAvailabilityChanged(
                    menuItem,
                    dto.available
                );
            }
        }

        if (dto.variants !== undefined) {
            menuItem.variants = dto.variants;
        }

        if (dto.addons !== undefined) {
            menuItem.addons = dto.addons;
        }

        if (dto.metadata !== undefined) {
            menuItem.metadata = { ...menuItem.metadata, ...dto.metadata };
        }

        // Update source tracking
        if (overriddenFields.length > 0) {
            menuItem.source = {
                overriddenFields,
                overriddenBy: 'restaurant',
                overriddenAt: new Date(),
                overriddenByUserId: userId,
            };
        }

        await menuItem.save();

        // Invalidate cache
        await this.invalidateMenuCache(menuItem.restaurantId);
        await this.cache.delete(`menu:item:${menuItemId}`);

        // Publish event
        await this.eventPublisher.publishMenuItemUpdated(menuItem);

        this.logger.info('Menu item updated successfully', { menuItemId });

        return menuItem;
    }

    /**
     * Delete a menu item
     */
    async deleteMenuItem(menuItemId: string): Promise<void> {
        this.logger.info('Deleting menu item', { menuItemId });

        const menuItem = await MenuItem.findById(menuItemId);

        if (!menuItem) {
            throw new AppError('Menu item not found', 404, 'MENU_ITEM_NOT_FOUND');
        }

        await MenuItem.findByIdAndDelete(menuItemId);

        // Invalidate cache
        await this.invalidateMenuCache(menuItem.restaurantId);
        await this.cache.delete(`menu:item:${menuItemId}`);

        // Publish event
        await this.eventPublisher.publishMenuItemDeleted(menuItem);

        this.logger.info('Menu item deleted successfully', { menuItemId });
    }

    /**
     * Find all restaurants serving a specific food item
     */
    async getRestaurantsByFoodItem(foodItemId: string): Promise<IMenuItem[]> {
        const cacheKey = `menu:fooditem:${foodItemId}:restaurants`;
        const cached = await this.cache.get<IMenuItem[]>(cacheKey);

        if (cached) {
            return cached;
        }

        const menuItems = await MenuItem.findByFoodItem(foodItemId);

        await this.cache.set(cacheKey, menuItems, 600); // 10 minutes TTL

        return menuItems;
    }

    /**
     * Sync menu item with updated FoodItem data
     * TODO: Implement when FoodItem service is ready
     */
    async syncWithFoodItem(foodItemId: string): Promise<void> {
        this.logger.info('Syncing menu items with FoodItem - NOT IMPLEMENTED YET', { foodItemId });
        // Implementation will be added when FoodItem service is available
        return;

        // const foodItem = await this.foodItemService.getFoodItem(foodItemId);

        // if (!foodItem) {
        //     this.logger.warn('FoodItem not found for sync', { foodItemId });
        //     return;
        // }

        // const menuItems = await MenuItem.find({ foodItemId });

        // for (const menuItem of menuItems) {
        //     let updated = false;

        //     // Only update fields that haven't been overridden
        //     const overriddenFields = menuItem.source?.overriddenFields || [];

        //     if (!overriddenFields.includes('title')) {
        //         menuItem.title = foodItem.name;
        //         updated = true;
        //     }

        //     if (!overriddenFields.includes('description') && foodItem.description) {
        //         menuItem.description = foodItem.description;
        //         updated = true;
        //     }

        //     if (!overriddenFields.includes('price')) {
        //         menuItem.price = foodItem.basePrice;
        //         updated = true;
        //     }

        //     if (updated) {
        //         await menuItem.save();
        //         await this.invalidateMenuCache(menuItem.restaurantId);
        //         await this.eventPublisher.publishMenuItemUpdated(menuItem);
        //     }
        // }

        // this.logger.info('FoodItem sync completed', {
        //     foodItemId,
        //     updatedCount: menuItems.length,
        // });
    }

    /**
     * Helper: Invalidate menu cache for a restaurant
     */
    private async invalidateMenuCache(restaurantId: string): Promise<void> {
        await this.cache.delete(`menu:restaurant:${restaurantId}`);
        await this.cache.delete(`menu:restaurant:${restaurantId}:available`);
    }

    /**
     * Helper: Get cache key for restaurant menu
     */
    private getMenuCacheKey(
        restaurantId: string,
        availableOnly: boolean
    ): string {
        return availableOnly
            ? `menu:restaurant:${restaurantId}:available`
            : `menu:restaurant:${restaurantId}`;
    }

    /**
     * Helper: Paginate results
     */
    private paginateResults(
        items: IMenuItem[],
        page: number,
        limit: number
    ): { items: IMenuItem[]; total: number; page: number; pages: number } {
        const total = items.length;
        const pages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = items.slice(startIndex, endIndex);

        return {
            items: paginatedItems,
            total,
            page,
            pages,
        };
    }
}
