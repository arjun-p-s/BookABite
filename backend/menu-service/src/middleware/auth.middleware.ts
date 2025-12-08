import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from '../observability/logger';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

/**
 * User payload from JWT token
 */
export interface UserPayload {
    id: string;
    email: string;
    role: string;
    restaurantId?: string;
}

/**
 * Extend Express Request to include user
 */
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

/**
 * Authentication Middleware
 * Validates JWT tokens from Auth Service
 */
export class AuthMiddleware {
    private logger = Logger.getInstance();

    /**
     * Verify JWT token
     */
    public authenticate() {
        return async (req: Request, _res: Response, next: NextFunction) => {
            try {
                // Extract token from Authorization header
                const authHeader = req.headers.authorization;

                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    throw new UnauthorizedError('Missing or invalid authorization header');
                }

                const token = authHeader.substring(7); // Remove 'Bearer ' prefix

                // Verify token
                const secret = process.env.JWT_SECRET || 'your-secret-key';
                const decoded = jwt.verify(token, secret) as UserPayload;

                // Attach user to request
                req.user = decoded;

                this.logger.debug('User authenticated', {
                    userId: decoded.id,
                    role: decoded.role,
                });

                next();
            } catch (error: any) {
                if (error.name === 'JsonWebTokenError') {
                    next(new UnauthorizedError('Invalid token'));
                } else if (error.name === 'TokenExpiredError') {
                    next(new UnauthorizedError('Token expired'));
                } else {
                    next(error);
                }
            }
        };
    }

    /**
     * Require specific role
     */
    public requireRole(...roles: string[]) {
        return (req: Request, _res: Response, next: NextFunction) => {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }

            if (!roles.includes(req.user.role)) {
                this.logger.warn('Insufficient permissions', {
                    userId: req.user.id,
                    userRole: req.user.role,
                    requiredRoles: roles,
                });
                return next(
                    new ForbiddenError('Insufficient permissions for this operation')
                );
            }

            next();
        };
    }

    /**
     * Require restaurant ownership
     * Ensures user can only modify their own restaurant's menu
     */
    public requireRestaurantOwnership() {
        return (req: Request, _res: Response, next: NextFunction) => {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }

            const restaurantId = req.params.restaurantId;

            // Admin can access any restaurant
            if (req.user.role === 'admin') {
                return next();
            }

            // Restaurant owner can only access their own restaurant
            if (req.user.role === 'restaurant_owner') {
                if (req.user.restaurantId !== restaurantId) {
                    this.logger.warn('Restaurant ownership violation', {
                        userId: req.user.id,
                        userRestaurantId: req.user.restaurantId,
                        requestedRestaurantId: restaurantId,
                    });
                    return next(
                        new ForbiddenError('You can only modify your own restaurant menu')
                    );
                }
                return next();
            }

            next(new ForbiddenError('Insufficient permissions'));
        };
    }
}

// Export singleton instance
export const authMiddleware = new AuthMiddleware();
