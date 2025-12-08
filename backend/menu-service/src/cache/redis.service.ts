import Redis from 'ioredis';
import { Logger } from '../observability/logger';

/**
 * Redis Cache Service
 * Implements cache-aside pattern with TTL-based expiration
 */
export class CacheService {
    private static instance: CacheService;
    private client: Redis;
    private logger = Logger.getInstance();

    private constructor() {
        // Client initialized in connect()
    }

    private hasLoggedConnectionError = false;

    static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    /**
     * Connect to Redis
     */
    async connect(): Promise<void> {
        if (this.client) return;

        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            db: parseInt(process.env.REDIS_DB || '0'),
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
            lazyConnect: true // Don't connect on instantiation
        });

        this.client.on('connect', () => {
            this.logger.info('Redis cache connected');
            this.hasLoggedConnectionError = false;
        });

        this.client.on('error', (error: any) => {
            if (error.code === 'ECONNREFUSED') {
                if (!this.hasLoggedConnectionError) {
                    this.logger.warn('Redis connection failed - Is Redis running? (Cache will be disabled)');
                    this.hasLoggedConnectionError = true;
                }
            } else {
                this.logger.error('Redis cache error', { error });
            }
        });

        try {
            await this.client.connect();
        } catch (error) {
            // Already handled by error listener, but we catch here to prevent unhandled promise rejection
            // if lazyConnect is true and we call connect() manually
        }
    }

    /**
     * Get value from cache
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.client.get(key);

            if (!value) {
                this.logger.debug('Cache miss', { key });
                return null;
            }

            this.logger.debug('Cache hit', { key });
            return JSON.parse(value) as T;
        } catch (error) {
            this.logger.error('Cache get error', { key, error });
            return null; // Fail gracefully
        }
    }

    /**
     * Set value in cache with TTL
     */
    async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
        try {
            await this.client.setex(key, ttlSeconds, JSON.stringify(value));
            this.logger.debug('Cache set', { key, ttl: ttlSeconds });
        } catch (error) {
            this.logger.error('Cache set error', { key, error });
            // Don't throw - caching is not critical
        }
    }

    /**
     * Delete key from cache
     */
    async delete(key: string): Promise<void> {
        try {
            await this.client.del(key);
            this.logger.debug('Cache delete', { key });
        } catch (error) {
            this.logger.error('Cache delete error', { key, error });
        }
    }

    /**
     * Delete multiple keys matching pattern
     */
    async deletePattern(pattern: string): Promise<void> {
        try {
            const keys = await this.client.keys(pattern);

            if (keys.length > 0) {
                await this.client.del(...keys);
                this.logger.debug('Cache pattern delete', { pattern, count: keys.length });
            }
        } catch (error) {
            this.logger.error('Cache pattern delete error', { pattern, error });
        }
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            this.logger.error('Cache exists error', { key, error });
            return false;
        }
    }

    /**
     * Acquire distributed lock
     * Prevents cache stampede
     */
    async acquireLock(
        lockKey: string,
        ttlSeconds: number = 10
    ): Promise<boolean> {
        try {
            const result = await this.client.set(
                `lock:${lockKey}`,
                '1',
                'EX',
                ttlSeconds,
                'NX'
            );
            return result === 'OK';
        } catch (error) {
            this.logger.error('Lock acquire error', { lockKey, error });
            return false;
        }
    }

    /**
     * Release distributed lock
     */
    async releaseLock(lockKey: string): Promise<void> {
        try {
            await this.client.del(`lock:${lockKey}`);
        } catch (error) {
            this.logger.error('Lock release error', { lockKey, error });
        }
    }

    /**
     * Increment counter (for rate limiting)
     */
    async increment(key: string, ttlSeconds?: number): Promise<number> {
        try {
            const value = await this.client.incr(key);

            if (ttlSeconds && value === 1) {
                await this.client.expire(key, ttlSeconds);
            }

            return value;
        } catch (error) {
            this.logger.error('Cache increment error', { key, error });
            return 0;
        }
    }

    /**
     * Get cache statistics
     */
    async getStats(): Promise<{
        hits: number;
        misses: number;
        hitRate: number;
    }> {
        try {
            const info = await this.client.info('stats');
            const lines = info.split('\r\n');

            let hits = 0;
            let misses = 0;

            for (const line of lines) {
                if (line.startsWith('keyspace_hits:')) {
                    hits = parseInt(line.split(':')[1]);
                } else if (line.startsWith('keyspace_misses:')) {
                    misses = parseInt(line.split(':')[1]);
                }
            }

            const total = hits + misses;
            const hitRate = total > 0 ? hits / total : 0;

            return { hits, misses, hitRate };
        } catch (error) {
            this.logger.error('Failed to get cache stats', { error });
            return { hits: 0, misses: 0, hitRate: 0 };
        }
    }

    /**
     * Warm cache for popular restaurants
     */
    async warmCache(restaurantIds: string[]): Promise<void> {
        this.logger.info('Warming cache for restaurants', {
            count: restaurantIds.length,
        });

        // Implementation would fetch menu data and populate cache
        // This is a placeholder for the actual implementation
    }

    /**
     * Close Redis connection
     */
    async disconnect(): Promise<void> {
        await this.client.quit();
        this.logger.info('Redis cache disconnected');
    }
}
