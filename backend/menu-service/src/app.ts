import 'dotenv/config';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { MenuController } from './controllers/menu.controller';
import { errorHandler } from './middleware/error.middleware';
import { Logger } from './observability/logger';
import { EventPublisher } from './events/publisher';
import { EventConsumer } from './events/consumer';
import { CacheService } from './cache/redis.service';

/**
 * Main Application Class
 */
export class App {
    public app: Application;
    private logger = Logger.getInstance();
    private eventPublisher = EventPublisher.getInstance();
    private eventConsumer = EventConsumer.getInstance();
    private cacheService = CacheService.getInstance();

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    /**
     * Initialize middlewares
     */
    private initializeMiddlewares(): void {
        // Security
        this.app.use(helmet());
        this.app.use(cors());

        // Compression
        this.app.use(compression());

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request logging
        this.app.use((req, _res, next) => {
            this.logger.info('Incoming request', {
                method: req.method,
                path: req.path,
                ip: req.ip,
            });
            next();
        });
    }

    /**
     * Initialize routes
     */
    private initializeRoutes(): void {
        const menuController = new MenuController();

        // Health check
        this.app.get('/health', (_req, res) => {
            res.status(200).json({
                status: 'healthy',
                service: 'menu-service',
                timestamp: new Date().toISOString(),
            });
        });

        // Readiness check
        this.app.get('/ready', async (_req, res) => {
            try {
                // Check database connection
                const dbState = mongoose.connection.readyState;
                if (dbState !== 1) {
                    throw new Error('Database not ready');
                }

                res.status(200).json({
                    status: 'ready',
                    database: 'connected',
                    cache: 'connected',
                });
            } catch (error) {
                res.status(503).json({
                    status: 'not ready',
                    error: (error as Error).message,
                });
            }
        });

        // API routes
        this.app.use('/v1', menuController.router);
    }

    /**
     * Initialize error handling
     */
    private initializeErrorHandling(): void {
        this.app.use(errorHandler);
    }

    /**
     * Connect to MongoDB
     */
    async connectDatabase(): Promise<void> {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/menu-service';

        try {
            await mongoose.connect(mongoUri);

            this.logger.info('MongoDB connected successfully', {
                uri: mongoUri.replace(/\/\/.*@/, '//***@'), // Hide credentials
            });
        } catch (error: any) {
            if (error.name === 'MongooseServerSelectionError' || error.code === 'ECONNREFUSED') {
                this.logger.error('MongoDB connection failed - Is MongoDB running?');
                this.logger.error('Please start MongoDB on port 27017');
            } else {
                this.logger.error('MongoDB connection failed', { error });
            }
            throw error;
        }
    }

    /**
     * Start event consumers and publishers
     */
    async startEventHandlers(): Promise<void> {
        try {
            await this.eventPublisher.connect();
            try {
                await this.eventConsumer.start();
            } catch (error) {
                this.logger.warn('Event consumer failed to start - Events will not be consumed');
            }
            this.logger.info('Event handlers initialized');
        } catch (error: any) {
            this.logger.warn('Event handlers failed to initialize - running in isolated mode');
        }
    }


    /**
     * Start the server
     */
    async listen(port: number): Promise<void> {
        try {
            // Connect to database
            await this.connectDatabase();

            // Connect to cache
            await this.cacheService.connect();

            // Start event handlers
            await this.startEventHandlers();

            // Start HTTP server
            this.app.listen(port, () => {
                console.log('\n==================================================');
                console.log(`🚀 Menu Service running on port ${port}`);
                console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
                console.log('==================================================\n');

                this.logger.info(`Menu Service listening on port ${port}`, {
                    environment: process.env.NODE_ENV || 'development',
                });
            });
        } catch (error) {
            this.logger.error('Failed to start server', { error });
            process.exit(1);
        }
    }

    /**
     * Graceful shutdown
     */
    async shutdown(): Promise<void> {
        this.logger.info('Shutting down gracefully...');

        try {
            // Stop event handlers
            await this.eventPublisher.disconnect();
            await this.eventConsumer.stop();

            // Disconnect from database
            await mongoose.disconnect();

            // Disconnect from cache
            await this.cacheService.disconnect();

            this.logger.info('Shutdown complete');
            process.exit(0);
        } catch (error) {
            this.logger.error('Error during shutdown', { error });
            process.exit(1);
        }
    }
}

// Start the application
const port = parseInt(process.env.PORT || '3000');
const app = new App();

app.listen(port).catch(error => {
    console.error('Unhandled startup error:', error);
    process.exit(1);
});

// Handle shutdown signals
process.on('SIGTERM', () => app.shutdown());
process.on('SIGINT', () => app.shutdown());
