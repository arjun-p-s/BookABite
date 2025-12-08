/**
 * Event Schemas for Menu Service
 * Following CloudEvents specification for event-driven architecture
 */

export interface CloudEvent<T = any> {
    specversion: string;
    type: string;
    source: string;
    id: string;
    time: string;
    datacontenttype: string;
    data: T;
}

/**
 * MenuItem Created Event
 */
export interface MenuItemCreatedData {
    menuItemId: string;
    restaurantId: string;
    foodItemId: string;
    title: string;
    price: number;
    currency: string;
    available: boolean;
    createdAt: string;
}

export type MenuItemCreatedEvent = CloudEvent<MenuItemCreatedData>;

/**
 * MenuItem Updated Event
 */
export interface MenuItemUpdatedData {
    menuItemId: string;
    restaurantId: string;
    foodItemId: string;
    title: string;
    price: number;
    currency: string;
    available: boolean;
    updatedAt: string;
    changes: string[]; // List of changed fields
}

export type MenuItemUpdatedEvent = CloudEvent<MenuItemUpdatedData>;

/**
 * MenuItem Deleted Event
 */
export interface MenuItemDeletedData {
    menuItemId: string;
    restaurantId: string;
    foodItemId: string;
    deletedAt: string;
}

export type MenuItemDeletedEvent = CloudEvent<MenuItemDeletedData>;

/**
 * MenuItem Availability Changed Event
 */
export interface MenuItemAvailabilityChangedData {
    menuItemId: string;
    restaurantId: string;
    foodItemId: string;
    available: boolean;
    changedAt: string;
}

export type MenuItemAvailabilityChangedEvent =
    CloudEvent<MenuItemAvailabilityChangedData>;

/**
 * FoodItem Updated Event (consumed from FoodItem Service)
 */
export interface FoodItemUpdatedData {
    foodItemId: string;
    name: string;
    description?: string;
    basePrice: number;
    currency: string;
    images?: string[];
    tags?: string[];
    updatedAt: string;
}

export type FoodItemUpdatedEvent = CloudEvent<FoodItemUpdatedData>;

/**
 * FoodItem Deleted Event (consumed from FoodItem Service)
 */
export interface FoodItemDeletedData {
    foodItemId: string;
    deletedAt: string;
}

export type FoodItemDeletedEvent = CloudEvent<FoodItemDeletedData>;

/**
 * Restaurant Deleted Event (consumed from Restaurant Service)
 */
export interface RestaurantDeletedData {
    restaurantId: string;
    deletedAt: string;
}

export type RestaurantDeletedEvent = CloudEvent<RestaurantDeletedData>;

/**
 * Event Types Enum
 */
export enum EventType {
    // Published by Menu Service
    MENU_ITEM_CREATED = 'com.bookabite.menu.item.created.v1',
    MENU_ITEM_UPDATED = 'com.bookabite.menu.item.updated.v1',
    MENU_ITEM_DELETED = 'com.bookabite.menu.item.deleted.v1',
    MENU_ITEM_AVAILABILITY_CHANGED = 'com.bookabite.menu.item.availability.changed.v1',

    // Consumed by Menu Service
    FOOD_ITEM_CREATED = 'com.bookabite.fooditem.created.v1',
    FOOD_ITEM_UPDATED = 'com.bookabite.fooditem.updated.v1',
    FOOD_ITEM_DELETED = 'com.bookabite.fooditem.deleted.v1',
    RESTAURANT_UPDATED = 'com.bookabite.restaurant.updated.v1',
    RESTAURANT_DELETED = 'com.bookabite.restaurant.deleted.v1',
}

/**
 * Event Topics
 */
export enum EventTopic {
    MENU_EVENTS = 'menu-events',
    FOOD_ITEM_EVENTS = 'fooditem-events',
    RESTAURANT_EVENTS = 'restaurant-events',
}
