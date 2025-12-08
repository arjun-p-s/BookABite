import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Logger } from '../observability/logger';
import { MenuService } from '../services/menu.service';
import { MenuItem } from '../models/MenuItem.model';
import {
    EventType,
    EventTopic,
    FoodItemUpdatedEvent,
    FoodItemDeletedEvent,
    RestaurantDeletedEvent,
} from './schemas';

/**
 * Event Consumer for Menu Service
 * Consumes events from FoodItem and Restaurant services
 */
export class EventConsumer {
    private static instance: EventConsumer;
    private consumer: Consumer;
    private logger = Logger.getInstance();
    private menuService = new MenuService();
    private kafka: Kafka;

    private constructor() {
        this.kafka = new Kafka({
            clientId: 'menu-service',
            brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
            retry: {
                initialRetryTime: 100,
                retries: 5,
                maxRetryTime: 5000,
            },
        });

        this.consumer = this.kafka.consumer({
            groupId: 'menu-service-consumer-group',
            sessionTimeout: 30000,
            heartbeatInterval: 3000,
        });
    }

    static getInstance(): EventConsumer {
        if (!EventConsumer.instance) {
            EventConsumer.instance = new EventConsumer();
        }
        return EventConsumer.instance;
    }

    /**
     * Start consuming events
     */
    async start(): Promise<void> {
        try {
            await this.consumer.connect();

            // Subscribe to relevant topics
            await this.consumer.subscribe({
                topics: [EventTopic.FOOD_ITEM_EVENTS, EventTopic.RESTAURANT_EVENTS],
                fromBeginning: false,
            });

            await this.consumer.run({
                eachMessage: async (payload: EachMessagePayload) => {
                    await this.handleMessage(payload);
                },
            });

            this.logger.info('Event consumer started');
        } catch (error) {
            this.logger.error('Failed to start event consumer', { error });
            throw error;
        }
    }

    /**
     * Stop consuming events
     */
    async stop(): Promise<void> {
        await this.consumer.disconnect();
        this.logger.info('Event consumer stopped');
    }

    /**
     * Handle incoming message
     */
    private async handleMessage(payload: EachMessagePayload): Promise<void> {
        const { topic, partition, message } = payload;

        try {
            const eventType = message.headers?.['event-type']?.toString();
            const eventData = JSON.parse(message.value?.toString() || '{}');

            this.logger.info('Processing event', {
                topic,
                partition,
                offset: message.offset,
                eventType,
            });

            switch (eventType) {
                case EventType.FOOD_ITEM_UPDATED:
                    await this.handleFoodItemUpdated(eventData as FoodItemUpdatedEvent);
                    break;

                case EventType.FOOD_ITEM_DELETED:
                    await this.handleFoodItemDeleted(eventData as FoodItemDeletedEvent);
                    break;

                case EventType.RESTAURANT_DELETED:
                    await this.handleRestaurantDeleted(
                        eventData as RestaurantDeletedEvent
                    );
                    break;

                default:
                    this.logger.debug('Unhandled event type', { eventType });
            }
        } catch (error) {
            this.logger.error('Error processing event', {
                topic,
                partition,
                offset: message.offset,
                error,
            });

            // Don't throw - let Kafka retry or move to next message
            // Implement dead letter queue logic if needed
        }
    }

    /**
     * Handle FoodItem.Updated event
     * Sync menu items with updated FoodItem data
     */
    private async handleFoodItemUpdated(
        event: FoodItemUpdatedEvent
    ): Promise<void> {
        const { foodItemId } = event.data;

        this.logger.info('Handling FoodItem.Updated event', { foodItemId });

        try {
            await this.menuService.syncWithFoodItem(foodItemId);
        } catch (error) {
            this.logger.error('Failed to sync with FoodItem', {
                foodItemId,
                error,
            });
            throw error;
        }
    }

    /**
     * Handle FoodItem.Deleted event
     * Mark all menu items as unavailable
     */
    private async handleFoodItemDeleted(
        event: FoodItemDeletedEvent
    ): Promise<void> {
        const { foodItemId } = event.data;

        this.logger.info('Handling FoodItem.Deleted event', { foodItemId });

        try {
            const menuItems = await MenuItem.find({ foodItemId });

            for (const menuItem of menuItems) {
                menuItem.available = false;
                await menuItem.save();
            }

            this.logger.info('Marked menu items as unavailable', {
                foodItemId,
                count: menuItems.length,
            });
        } catch (error) {
            this.logger.error('Failed to handle FoodItem deletion', {
                foodItemId,
                error,
            });
            throw error;
        }
    }

    /**
     * Handle Restaurant.Deleted event
     * Cascade delete all menu items for the restaurant
     */
    private async handleRestaurantDeleted(
        event: RestaurantDeletedEvent
    ): Promise<void> {
        const { restaurantId } = event.data;

        this.logger.info('Handling Restaurant.Deleted event', { restaurantId });

        try {
            const result = await MenuItem.deleteMany({ restaurantId });

            this.logger.info('Deleted menu items for restaurant', {
                restaurantId,
                deletedCount: result.deletedCount,
            });
        } catch (error) {
            this.logger.error('Failed to handle Restaurant deletion', {
                restaurantId,
                error,
            });
            throw error;
        }
    }
}
