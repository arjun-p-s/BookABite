import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

/**
 * Structured Logger using Winston
 * Provides JSON-formatted logs with correlation IDs
 */
export class Logger {
    private static instance: Logger;
    private logger: WinstonLogger;

    private constructor() {
        this.logger = createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.json()
            ),
            defaultMeta: {
                service: 'menu-service',
                environment: process.env.NODE_ENV || 'development',
            },
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.printf(({ timestamp, level, message, ...meta }) => {
                            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                                }`;
                        })
                    ),
                }),
            ],
        });

        // Add file transport in production
        if (process.env.NODE_ENV === 'production') {
            this.logger.add(
                new transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                })
            );
            this.logger.add(
                new transports.File({
                    filename: 'logs/combined.log',
                })
            );
        }
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    info(message: string, meta?: any): void {
        this.logger.info(message, this.sanitizeMeta(meta));
    }

    error(message: string, meta?: any): void {
        this.logger.error(message, this.sanitizeMeta(meta));
    }

    warn(message: string, meta?: any): void {
        this.logger.warn(message, this.sanitizeMeta(meta));
    }

    debug(message: string, meta?: any): void {
        this.logger.debug(message, this.sanitizeMeta(meta));
    }

    /**
     * Sanitize metadata to remove PII
     */
    private sanitizeMeta(meta?: any): any {
        if (!meta) return {};

        const sanitized = { ...meta };

        // Redact sensitive fields
        const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];

        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        }

        return sanitized;
    }
}
