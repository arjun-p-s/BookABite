import { Kafka, Producer, ProducerRecord, RecordMetadata, Partitioners } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../observability/logger';
import { IMenuItem } from '../models/MenuItem.model';
import {
    CloudEvent,
    EventType,
    EventTopic,
    MenuItemCreatedData,
    MenuItemUpdatedData,
    MenuItemDeletedData,
    MenuItemAvailabilityChangedData,
} from './schemas';

/**
 * Event Publisher for Menu Service
 * Publishes events to Kafka with retry logic and idempotency
 */
export class EventPublisher {
    private static instance: EventPublisher;
    private producer: Producer;
    private logger = Logger.getInstance();
    private kafka: Kafka;

    private isConnected = false;

    private constructor() {
        this.kafka = new Kafka({
            clientId: 'menu-service',
            brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
            retry: {
                initialRetryTime: 100,
                retries: 5, // Reduce retries to fail faster during startup
                maxRetryTime: 5000,
            },
        });

        this.producer = this.kafka.producer({
            createPartitioner: Partitioners.DefaultPartitioner,
            idempotent: false, // Disabled to allow limited retries without warning
            maxInFlightRequests: 5,
            transactionalId: 'menu-service-producer',
        });
    }

    static getInstance(): EventPublisher {
        if (!EventPublisher.instance) {
            EventPublisher.instance = new EventPublisher();
        }
        return EventPublisher.instance;
    }

    /**
     * Connect to Kafka
     */
    /**
     * Connect to Kafka
     */
    async connect(): Promise<void> {
        try {
            await this.producer.connect();
            this.isConnected = true;
            this.logger.info('Event publisher connected to Kafka');
        } catch (error) {
            this.logger.warn('Failed to connect event publisher - Events will not be published', {
                error: (error as Error).message
            });
            // Do not throw - allow app to start without Kafka
        }
    }

    /**
     * Disconnect from Kafka
     */
    /**
     * Disconnect from Kafka
     */
    async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
            this.logger.info('Event publisher disconnected');
        }
    }

    /**
     * Publish MenuItem.Created event
     */
    async publishMenuItemCreated(menuItem: IMenuItem): Promise<void> {
        const event: CloudEvent<MenuItemCreatedData> = {
            specversion: '1.0',
            type: EventType.MENU_ITEM_CREATED,
            source: 'menu-service',
            id: uuidv4(),
            time: new Date().toISOString(),
            datacontenttype: 'application/json',
            data: {
                menuItemId: menuItem._id.toString(),
                restaurantId: menuItem.restaurantId,
                foodItemId: menuItem.foodItemId,
                title: menuItem.title,
                price: menuItem.price,
                currency: menuItem.currency,
                available: menuItem.available,
                createdAt: menuItem.createdAt.toISOString(),
            },
        };

        await this.publishEvent(EventTopic.MENU_EVENTS, event, menuItem._id.toString());
    }

    /**
     * Publish MenuItem.Updated event
     */
    async publishMenuItemUpdated(
        menuItem: IMenuItem,
        changes?: string[]
    ): Promise<void> {
        const event: CloudEvent<MenuItemUpdatedData> = {
            specversion: '1.0',
            type: EventType.MENU_ITEM_UPDATED,
            source: 'menu-service',
            id: uuidv4(),
            time: new Date().toISOString(),
            datacontenttype: 'application/json',
            data: {
                menuItemId: menuItem._id.toString(),
                restaurantId: menuItem.restaurantId,
                foodItemId: menuItem.foodItemId,
                title: menuItem.title,
                price: menuItem.price,
                currency: menuItem.currency,
                available: menuItem.available,
                updatedAt: menuItem.updatedAt.toISOString(),
                changes: changes || menuItem.source?.overriddenFields || [],
            },
        };

        await this.publishEvent(EventTopic.MENU_EVENTS, event, menuItem._id.toString());
    }

    /**
     * Publish MenuItem.Deleted event
     */
    async publishMenuItemDeleted(menuItem: IMenuItem): Promise<void> {
        const event: CloudEvent<MenuItemDeletedData> = {
            specversion: '1.0',
            type: EventType.MENU_ITEM_DELETED,
            source: 'menu-service',
            id: uuidv4(),
            time: new Date().toISOString(),
            datacontenttype: 'application/json',
            data: {
                menuItemId: menuItem._id.toString(),
                restaurantId: menuItem.restaurantId,
                foodItemId: menuItem.foodItemId,
                deletedAt: new Date().toISOString(),
            },
        };

        await this.publishEvent(EventTopic.MENU_EVENTS, event, menuItem._id.toString());
    }

    /**
     * Publish MenuItem.AvailabilityChanged event
     */
    async publishMenuItemAvailabilityChanged(
        menuItem: IMenuItem,
        available: boolean
    ): Promise<void> {
        const event: CloudEvent<MenuItemAvailabilityChangedData> = {
            specversion: '1.0',
            type: EventType.MENU_ITEM_AVAILABILITY_CHANGED,
            source: 'menu-service',
            id: uuidv4(),
            time: new Date().toISOString(),
            datacontenttype: 'application/json',
            data: {
                menuItemId: menuItem._id.toString(),
                restaurantId: menuItem.restaurantId,
                foodItemId: menuItem.foodItemId,
                available,
                changedAt: new Date().toISOString(),
            },
        };

        await this.publishEvent(EventTopic.MENU_EVENTS, event, menuItem._id.toString());
    }

    /**
     * Generic event publishing with retry logic
     */
    private async publishEvent<T>(
        topic: EventTopic,
        event: CloudEvent<T>,
        key: string
    ): Promise<void> {
        if (!this.isConnected) {
            this.logger.debug('Skipping event publish - Kafka not connected', {
                eventType: event.type
            });
            return;
        }

        const record: ProducerRecord = {
            topic,
            messages: [
                {
                    key,
                    value: JSON.stringify(event),
                    headers: {
                        'event-type': event.type,
                        'event-id': event.id,
                        'event-source': event.source,
                    },
                },
            ],
        };

        try {
            const metadata: RecordMetadata[] = await this.producer.send(record);

            this.logger.info('Event published successfully', {
                eventType: event.type,
                eventId: event.id,
                topic,
                partition: metadata[0].partition,
                offset: metadata[0].offset,
            });
        } catch (error) {
            this.logger.error('Failed to publish event', {
                eventType: event.type,
                eventId: event.id,
                topic,
                error,
            });

            // Send to dead letter queue
            await this.sendToDeadLetterQueue(event, error);

            // Do not throw - prevent API failures due to Kafka issues
        }
    }

    /**
     * Send failed events to dead letter queue
     */
    private async sendToDeadLetterQueue<T>(
        event: CloudEvent<T>,
        error: any
    ): Promise<void> {
        try {
            await this.producer.send({
                topic: 'menu-events-dlq',
                messages: [
                    {
                        key: event.id,
                        value: JSON.stringify({
                            event,
                            error: {
                                message: error.message,
                                stack: error.stack,
                            },
                            timestamp: new Date().toISOString(),
                        }),
                    },
                ],
            });

            this.logger.info('Event sent to dead letter queue', {
                eventId: event.id,
                eventType: event.type,
            });
        } catch (dlqError) {
            this.logger.error('Failed to send event to DLQ', {
                eventId: event.id,
                error: dlqError,
            });
        }
    }
}
