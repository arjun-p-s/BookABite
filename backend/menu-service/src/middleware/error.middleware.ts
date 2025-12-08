import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { Logger } from '../observability/logger';

/**
 * Global Error Handler Middleware
 */
export function errorHandler(
    error: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const logger = Logger.getInstance();

    // Log error
    logger.error('Request error', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
    });

    // Handle AppError
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
            },
        });
        return;
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: error.message,
            },
        });
        return;
    }

    // Handle Mongoose cast errors
    if (error.name === 'CastError') {
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: 'Invalid ID format',
            },
        });
        return;
    }

    // Handle duplicate key errors
    if ((error as any).code === 11000) {
        res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ENTRY',
                message: 'Resource already exists',
            },
        });
        return;
    }

    // Default error response
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
        },
    });
}
