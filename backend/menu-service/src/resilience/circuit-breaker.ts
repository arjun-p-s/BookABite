import { Logger } from '../observability/logger';

/**
 * Circuit Breaker States
 */
enum CircuitState {
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
    HALF_OPEN = 'HALF_OPEN',
}

/**
 * Circuit Breaker Options
 */
interface CircuitBreakerOptions {
    failureThreshold: number; // Number of failures before opening
    resetTimeout: number; // Time in ms before attempting to close
    successThreshold?: number; // Successes needed in half-open to close
}

/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures when calling external services
 */
export class CircuitBreaker {
    private state: CircuitState = CircuitState.CLOSED;
    private failureCount: number = 0;
    private successCount: number = 0;
    private nextAttempt: number = Date.now();
    private logger = Logger.getInstance();

    constructor(
        private serviceName: string,
        private options: CircuitBreakerOptions
    ) {
        this.options.successThreshold = options.successThreshold || 2;
    }

    /**
     * Execute function with circuit breaker protection
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() < this.nextAttempt) {
                throw new Error(
                    `Circuit breaker is OPEN for ${this.serviceName}. Service unavailable.`
                );
            }

            // Try to recover
            this.state = CircuitState.HALF_OPEN;
            this.logger.info('Circuit breaker entering HALF_OPEN state', {
                service: this.serviceName,
            });
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    /**
     * Handle successful execution
     */
    private onSuccess(): void {
        this.failureCount = 0;

        if (this.state === CircuitState.HALF_OPEN) {
            this.successCount++;

            if (this.successCount >= this.options.successThreshold!) {
                this.state = CircuitState.CLOSED;
                this.successCount = 0;
                this.logger.info('Circuit breaker CLOSED', {
                    service: this.serviceName,
                });
            }
        }
    }

    /**
     * Handle failed execution
     */
    private onFailure(): void {
        this.failureCount++;

        if (this.failureCount >= this.options.failureThreshold) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.options.resetTimeout;

            this.logger.error('Circuit breaker OPENED', {
                service: this.serviceName,
                failureCount: this.failureCount,
                nextAttempt: new Date(this.nextAttempt).toISOString(),
            });
        }
    }

    /**
     * Get current state
     */
    getState(): CircuitState {
        return this.state;
    }

    /**
     * Reset circuit breaker
     */
    reset(): void {
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.logger.info('Circuit breaker manually reset', {
            service: this.serviceName,
        });
    }
}
