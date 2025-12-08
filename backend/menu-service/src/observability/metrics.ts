import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

/**
 * Prometheus Metrics for Menu Service
 */
export class Metrics {
    private static instance: Metrics;

    // HTTP Metrics
    public httpRequestDuration: Histogram<string>;
    public httpRequestTotal: Counter<string>;
    public httpRequestErrors: Counter<string>;

    // Cache Metrics
    public cacheHits: Counter<string>;
    public cacheMisses: Counter<string>;
    public cacheOperationDuration: Histogram<string>;

    // Database Metrics
    public dbQueryDuration: Histogram<string>;
    public dbConnectionPoolSize: Gauge<string>;

    // Event Metrics
    public eventsPublished: Counter<string>;
    public eventsConsumed: Counter<string>;
    public eventPublishErrors: Counter<string>;
    public eventProcessingLag: Gauge<string>;

    // Business Metrics
    public menuItemsCreated: Counter<string>;
    public menuItemsUpdated: Counter<string>;
    public menuItemsDeleted: Counter<string>;

    private constructor() {
        // Collect default metrics (CPU, memory, etc.)
        collectDefaultMetrics({ register });

        // HTTP Request Duration
        this.httpRequestDuration = new Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
        });

        // HTTP Request Total
        this.httpRequestTotal = new Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
        });

        // HTTP Request Errors
        this.httpRequestErrors = new Counter({
            name: 'http_request_errors_total',
            help: 'Total number of HTTP request errors',
            labelNames: ['method', 'route', 'error_code'],
        });

        // Cache Hits
        this.cacheHits = new Counter({
            name: 'cache_hits_total',
            help: 'Total number of cache hits',
            labelNames: ['cache_key_prefix'],
        });

        // Cache Misses
        this.cacheMisses = new Counter({
            name: 'cache_misses_total',
            help: 'Total number of cache misses',
            labelNames: ['cache_key_prefix'],
        });

        // Cache Operation Duration
        this.cacheOperationDuration = new Histogram({
            name: 'cache_operation_duration_seconds',
            help: 'Duration of cache operations in seconds',
            labelNames: ['operation'],
            buckets: [0.001, 0.005, 0.01, 0.05, 0.1],
        });

        // Database Query Duration
        this.dbQueryDuration = new Histogram({
            name: 'db_query_duration_seconds',
            help: 'Duration of database queries in seconds',
            labelNames: ['operation', 'collection'],
            buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
        });

        // Database Connection Pool Size
        this.dbConnectionPoolSize = new Gauge({
            name: 'db_connection_pool_size',
            help: 'Current size of database connection pool',
        });

        // Events Published
        this.eventsPublished = new Counter({
            name: 'events_published_total',
            help: 'Total number of events published',
            labelNames: ['event_type'],
        });

        // Events Consumed
        this.eventsConsumed = new Counter({
            name: 'events_consumed_total',
            help: 'Total number of events consumed',
            labelNames: ['event_type'],
        });

        // Event Publish Errors
        this.eventPublishErrors = new Counter({
            name: 'event_publish_errors_total',
            help: 'Total number of event publish errors',
            labelNames: ['event_type'],
        });

        // Event Processing Lag
        this.eventProcessingLag = new Gauge({
            name: 'event_processing_lag_seconds',
            help: 'Event processing lag in seconds',
            labelNames: ['topic'],
        });

        // Menu Items Created
        this.menuItemsCreated = new Counter({
            name: 'menu_items_created_total',
            help: 'Total number of menu items created',
            labelNames: ['restaurant_id'],
        });

        // Menu Items Updated
        this.menuItemsUpdated = new Counter({
            name: 'menu_items_updated_total',
            help: 'Total number of menu items updated',
            labelNames: ['restaurant_id'],
        });

        // Menu Items Deleted
        this.menuItemsDeleted = new Counter({
            name: 'menu_items_deleted_total',
            help: 'Total number of menu items deleted',
            labelNames: ['restaurant_id'],
        });
    }

    static getInstance(): Metrics {
        if (!Metrics.instance) {
            Metrics.instance = new Metrics();
        }
        return Metrics.instance;
    }

    /**
     * Get metrics in Prometheus format
     */
    async getMetrics(): Promise<string> {
        return register.metrics();
    }
}
