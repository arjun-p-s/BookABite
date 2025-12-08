import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../cache/redis.service';
import { Logger } from '../observability/logger';

/**
 * Rate Limiting Middleware
 * Implements token bucket algorithm with Redis
 */
export class RateLimiter {
    private cache = CacheService.getInstance();
    private logger = Logger.getInstance();

    /**
     * Create rate limiting middleware
     */
    public limit(options: {
        windowMs: number;
        maxRequests: number;
        keyGenerator?: (req: Request) => string;
    }) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const key = options.keyGenerator
                    ? options.keyGenerator(req)
                    : this.getDefaultKey(req);

                const rateLimitKey = `ratelimit:${key}`;
                const windowSeconds = Math.floor(options.windowMs / 1000);

                // Increment counter
                const currentCount = await this.cache.increment(
                    rateLimitKey,
                    windowSeconds
                );

                // Set rate limit headers
                res.setHeader('X-RateLimit-Limit', options.maxRequests);
                res.setHeader(
                    'X-RateLimit-Remaining',
                    Math.max(0, options.maxRequests - currentCount)
                );
                res.setHeader(
                    'X-RateLimit-Reset',
                    new Date(Date.now() + options.windowMs).toISOString()
                );

                // Check if limit exceeded
                if (currentCount > options.maxRequests) {
                    this.logger.warn('Rate limit exceeded', {
                        key,
                        currentCount,
                        maxRequests: options.maxRequests,
                        ip: req.ip,
                    });

                    res.status(429).json({
                        success: false,
                        error: {
                            code: 'RATE_LIMIT_EXCEEDED',
                            message: 'Too many requests, please try again later',
                            retryAfter: windowSeconds,
                        },
                    });
                    return;
                }

                next();
            } catch (error) {
                this.logger.error('Rate limiting error', { error });
                // Fail open - allow request if rate limiting fails
                next();
            }
        };
    }

    /**
     * Generate default key from request
     */
    private getDefaultKey(req: Request): string {
        // Use user ID if authenticated, otherwise use IP
        const userId = (req as any).user?.id;
        return userId || req.ip || 'anonymous';
    }
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
    // Standard API rate limit: 1000 requests per hour
    standard: new RateLimiter().limit({
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 1000,
    }),

    // Strict rate limit for write operations: 100 requests per hour
    strict: new RateLimiter().limit({
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 100,
    }),

    // Lenient rate limit for read operations: 5000 requests per hour
    lenient: new RateLimiter().limit({
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 5000,
    }),
};
