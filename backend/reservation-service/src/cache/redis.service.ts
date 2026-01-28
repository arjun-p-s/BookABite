import Redis from 'ioredis';

export class CacheService {
    private static instance: CacheService;
    private client: Redis;
    private isConnected: boolean = false;

    private constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            lazyConnect: true,
            retryStrategy: (times) => {
                if (times > 3) {
                    return null; // Stop retrying after 3 attempts
                }
                return Math.min(times * 50, 2000);
            }
        });

        this.client.on('error', (err) => {
            console.error('❌ Redis Client Error', err);
        });

        this.client.on('connect', () => {
            this.isConnected = true;
            console.log('✅ Redis Client Connected');
        });
    }

    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            try {
                await this.client.connect();
            } catch (error) {
                console.warn('⚠️ Redis Connection Failed - Running without caching');
                // Do not throw, allow service to start
            }
        }
    }

    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
        }
    }

    // Cache availability data
    public async cacheAvailability(
        restaurantId: string,
        date: string,
        time: string,
        data: any
    ): Promise<void> {
        if (!this.isConnected) return;
        const key = `availability:${restaurantId}:${date}:${time}`;
        await this.client.setex(key, 300, JSON.stringify(data)); // 5 min TTL
    }

    public async getAvailability(
        restaurantId: string,
        date: string,
        time: string
    ): Promise<any | null> {
        if (!this.isConnected) return null;
        const key = `availability:${restaurantId}:${date}:${time}`;
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    // Cache confirmation lookups
    public async cacheReservationByConfirmation(code: string, reservation: any): Promise<void> {
        if (!this.isConnected) return;
        const key = `reservation:confirmation:${code}`;
        await this.client.setex(key, 86400, JSON.stringify(reservation)); // 24 hr TTL
    }

    public async getReservationByConfirmation(code: string): Promise<any | null> {
        if (!this.isConnected) return null;
        const key = `reservation:confirmation:${code}`;
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    // Invalidate availability
    public async invalidateAvailability(restaurantId: string, date: string, time: string): Promise<void> {
        if (!this.isConnected) return;
        const key = `availability:${restaurantId}:${date}:${time}`;
        await this.client.del(key);
    }

    // Check health
    public async ping(): Promise<boolean> {
        if (!this.isConnected) return false;
        try {
            const pong = await this.client.ping();
            return pong === 'PONG';
        } catch (error) {
            return false;
        }
    }
}
