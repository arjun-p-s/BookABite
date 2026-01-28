import { Kafka, Producer } from 'kafkajs';
import { CloudEvent, EventTopic, EventType, ReservationCreatedData, ReservationCancelledData, ReservationStatusChangedData } from './schemas';
import { v4 as uuidv4 } from 'uuid';

export class EventPublisher {
    private static instance: EventPublisher;
    private producer: Producer;
    private isConnected: boolean = false;

    private constructor() {
        const kafka = new Kafka({
            clientId: 'reservation-service',
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
        });

        this.producer = kafka.producer();
    }

    public static getInstance(): EventPublisher {
        if (!EventPublisher.instance) {
            EventPublisher.instance = new EventPublisher();
        }
        return EventPublisher.instance;
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            try {
                await this.producer.connect();
                this.isConnected = true;
                console.log('✅ Kafka Producer connected');
            } catch (error) {
                console.error('❌ Failed to connect to Kafka:', error);
            }
        }
    }

    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
        }
    }

    private async publishEvent<T>(type: string, data: T, topic: string = EventTopic.RESERVATION_EVENTS): Promise<void> {
        if (!this.isConnected) {
            console.warn('⚠️ Kafka not connected, skipping event publication');
            return;
        }

        const event: CloudEvent<T> = {
            specversion: '1.0',
            type,
            source: 'reservation-service',
            id: uuidv4(),
            time: new Date().toISOString(),
            datacontenttype: 'application/json',
            data
        };

        try {
            await this.producer.send({
                topic,
                messages: [
                    { key: (data as any).restaurantId || 'unknown', value: JSON.stringify(event) }
                ]
            });
            console.log(`📡 Published event: ${type}`);
        } catch (error) {
            console.error(`❌ Failed to publish event ${type}:`, error);
        }
    }

    public async publishReservationCreated(data: ReservationCreatedData): Promise<void> {
        await this.publishEvent(EventType.RESERVATION_CREATED, data);
    }

    public async publishReservationCancelled(data: ReservationCancelledData): Promise<void> {
        await this.publishEvent(EventType.RESERVATION_CANCELLED, data);
    }

    public async publishReservationStatusChanged(data: ReservationStatusChangedData): Promise<void> {
        await this.publishEvent(EventType.RESERVATION_STATUS_CHANGED, data);
    }
}
