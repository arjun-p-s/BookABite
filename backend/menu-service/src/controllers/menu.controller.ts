import { Request, Response, NextFunction, Router } from 'express';
import { MenuService, CreateMenuItemDTO, UpdateMenuItemDTO } from '../services/menu.service';
import { AppError } from '../utils/errors';
import { body, param, query, validationResult } from 'express-validator';

/**
 * Menu Controller
 * Handles HTTP requests for menu operations
 */
export class MenuController {
    private menuService = new MenuService();
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Get restaurant menu
        this.router.get(
            '/restaurants/:restaurantId/menu',
            this.validateGetMenu(),
            this.getRestaurantMenu.bind(this)
        );

        // Get single menu item
        this.router.get(
            '/restaurants/:restaurantId/menu/:menuItemId',
            param('restaurantId').isString().notEmpty(),
            param('menuItemId').isString().notEmpty(),
            this.getMenuItem.bind(this)
        );

        // Create menu item
        this.router.post(
            '/restaurants/:restaurantId/menu',
            this.validateCreateMenuItem(),
            this.createMenuItem.bind(this)
        );

        // Update menu item
        this.router.patch(
            '/restaurants/:restaurantId/menu/:menuItemId',
            this.validateUpdateMenuItem(),
            this.updateMenuItem.bind(this)
        );

        // Delete menu item
        this.router.delete(
            '/restaurants/:restaurantId/menu/:menuItemId',
            param('restaurantId').isString().notEmpty(),
            param('menuItemId').isString().notEmpty(),
            this.deleteMenuItem.bind(this)
        );

        // Get restaurants by food item
        this.router.get(
            '/fooditems/:foodItemId/menus',
            param('foodItemId').isString().notEmpty(),
            this.getRestaurantsByFoodItem.bind(this)
        );

        // Search menu
        this.router.get(
            '/search',
            query('restaurantId').isString().notEmpty(),
            query('query').isString().notEmpty(),
            this.searchMenu.bind(this)
        );
    }

    /**
     * GET /v1/restaurants/:restaurantId/menu
     */
    private async getRestaurantMenu(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors.array());
            }

            const { restaurantId } = req.params;
            const {
                availableOnly = 'false',
                page = '1',
                limit = '50',
                sortBy = 'title',
                sortOrder = 'asc',
            } = req.query;

            const result = await this.menuService.getRestaurantMenu({
                restaurantId,
                availableOnly: availableOnly === 'true',
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                sortBy: sortBy as string,
                sortOrder: sortOrder as 'asc' | 'desc',
            });

            // Set ETag for caching
            const etag = this.generateETag(result);
            res.setHeader('ETag', etag);

            // Check If-None-Match header
            if (req.headers['if-none-match'] === etag) {
                res.status(304).end();
                return;
            }

            res.status(200).json({
                success: true,
                data: result.items,
                pagination: {
                    page: result.page,
                    limit,
                    total: result.total,
                    pages: result.pages,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /v1/restaurants/:restaurantId/menu/:menuItemId
     */
    private async getMenuItem(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { menuItemId } = req.params;

            const menuItem = await this.menuService.getMenuItem(menuItemId);

            if (!menuItem) {
                throw new AppError('Menu item not found', 404, 'MENU_ITEM_NOT_FOUND');
            }

            const etag = this.generateETag(menuItem);
            res.setHeader('ETag', etag);

            if (req.headers['if-none-match'] === etag) {
                res.status(304).end();
                return;
            }

            res.status(200).json({
                success: true,
                data: menuItem,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /v1/restaurants/:restaurantId/menu
     */
    private async createMenuItem(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors.array());
            }

            const { restaurantId } = req.params;
            const userId = (req as any).user?.id; // From auth middleware

            const dto: CreateMenuItemDTO = {
                ...req.body,
                restaurantId,
            };

            const menuItem = await this.menuService.createMenuItem(dto, userId);

            res.status(201).json({
                success: true,
                data: menuItem,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /v1/restaurants/:restaurantId/menu/:menuItemId
     */
    private async updateMenuItem(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors.array());
            }

            const { menuItemId } = req.params;
            const userId = (req as any).user?.id;
            const version = req.headers['if-match']
                ? parseInt(req.headers['if-match'] as string)
                : undefined;

            const dto: UpdateMenuItemDTO = req.body;

            const menuItem = await this.menuService.updateMenuItem(
                menuItemId,
                dto,
                userId,
                version
            );

            res.status(200).json({
                success: true,
                data: menuItem,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /v1/restaurants/:restaurantId/menu/:menuItemId
     */
    private async deleteMenuItem(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { menuItemId } = req.params;

            await this.menuService.deleteMenuItem(menuItemId);

            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /v1/fooditems/:foodItemId/menus
     */
    private async getRestaurantsByFoodItem(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { foodItemId } = req.params;

            const menuItems = await this.menuService.getRestaurantsByFoodItem(foodItemId);

            res.status(200).json({
                success: true,
                data: menuItems,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /v1/search
     */
    private async searchMenu(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { restaurantId, query: searchQuery } = req.query;

            const result = await this.menuService.getRestaurantMenu({
                restaurantId: restaurantId as string,
                search: searchQuery as string,
                availableOnly: true,
            });

            res.status(200).json({
                success: true,
                data: result.items,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Validation middleware for GET menu
     */
    private validateGetMenu() {
        return [
            param('restaurantId').isString().notEmpty(),
            query('availableOnly').optional().isBoolean(),
            query('page').optional().isInt({ min: 1 }),
            query('limit').optional().isInt({ min: 1, max: 100 }),
            query('sortBy').optional().isString(),
            query('sortOrder').optional().isIn(['asc', 'desc']),
        ];
    }

    /**
     * Validation middleware for creating menu item
     */
    private validateCreateMenuItem() {
        return [
            param('restaurantId').isString().notEmpty(),
            body('foodItemId').isString().notEmpty(),
            body('title').optional().isString().isLength({ min: 3, max: 200 }),
            body('description').optional().isString().isLength({ max: 1000 }),
            body('price').optional().isFloat({ min: 0 }),
            body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']),
            body('images').optional().isArray(),
            body('available').optional().isBoolean(),
            body('variants').optional().isArray(),
            body('addons').optional().isArray(),
        ];
    }

    /**
     * Validation middleware for updating menu item
     */
    private validateUpdateMenuItem() {
        return [
            param('restaurantId').isString().notEmpty(),
            param('menuItemId').isString().notEmpty(),
            body('title').optional().isString().isLength({ min: 3, max: 200 }),
            body('description').optional().isString().isLength({ max: 1000 }),
            body('price').optional().isFloat({ min: 0 }),
            body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']),
            body('images').optional().isArray(),
            body('available').optional().isBoolean(),
            body('variants').optional().isArray(),
            body('addons').optional().isArray(),
        ];
    }

    /**
     * Generate ETag for response
     */
    private generateETag(data: any): string {
        const crypto = require('crypto');
        return crypto
            .createHash('md5')
            .update(JSON.stringify(data))
            .digest('hex');
    }
}
