# Menu Service - README

## Overview

The **Menu Service** is a microservice in the BookABite platform that manages restaurant-specific menu data. It owns the relationship between restaurants and food items, allowing restaurants to customize pricing, availability, variants, and addons for each menu item.

## Key Features

- ✅ **Restaurant Menu Management**: CRUD operations for menu items
- ✅ **Price Overrides**: Restaurants can override global food item prices
- ✅ **Availability Management**: Real-time menu item availability
- ✅ **Variants & Addons**: Support for size variants and customizations
- ✅ **Event-Driven Architecture**: Publishes events for downstream services
- ✅ **Redis Caching**: High-performance caching with cache-aside pattern
- ✅ **Circuit Breakers**: Resilient integration with FoodItem Service
- ✅ **Optimistic Locking**: Prevents concurrent update conflicts
- ✅ **Full-Text Search**: MongoDB text search on menu items
- ✅ **Observability**: Structured logging, metrics, and distributed tracing

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│ API Gateway │────▶│ Auth Service │
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Menu Service                │
│  ┌──────────┐  ┌────────────────┐  │
│  │   API    │  │  Event Handler │  │
│  └────┬─────┘  └────────┬───────┘  │
│       │                 │           │
│  ┌────▼─────┐  ┌────────▼───────┐  │
│  │ Business │  │  Event Consumer│  │
│  │  Logic   │  │  & Publisher   │  │
│  └────┬─────┘  └────────┬───────┘  │
│       │                 │           │
│  ┌────▼─────┐  ┌────────▼───────┐  │
│  │ MongoDB  │  │     Kafka      │  │
│  └──────────┘  └────────────────┘  │
│       │                             │
│  ┌────▼─────┐                      │
│  │  Redis   │                      │
│  └──────────┘                      │
└─────────────────────────────────────┘
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis with ioredis
- **Events**: Kafka with KafkaJS
- **Observability**: Winston (logging), Prometheus (metrics), OpenTelemetry (tracing)
- **Deployment**: Docker + Kubernetes

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Redis 7+
- Kafka 3+

### Installation

```bash
# Clone repository
git clone https://github.com/bookabite/menu-service.git
cd menu-service

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

### Development

```bash
# Start in development mode with hot reload
npm run dev

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Build & Run

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## API Documentation

See [API.md](./docs/API.md) for complete API documentation.

### Quick Example

```bash
# Get restaurant menu
curl -X GET "http://localhost:3000/v1/restaurants/rest-123/menu" \
  -H "Authorization: Bearer <token>"

# Create menu item
curl -X POST "http://localhost:3000/v1/restaurants/rest-123/menu" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "foodItemId": "food-456",
    "title": "Margherita Pizza",
    "price": 12.99,
    "currency": "USD",
    "available": true
  }'
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | HTTP server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/menu-service` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `KAFKA_BROKERS` | Kafka broker addresses (comma-separated) | `localhost:9092` |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | `info` |



## Migration

See [migration-plan.md](./migration/migration-plan.md) for the complete 5-phase migration strategy.

```bash
# Run migration script
npm run migrate -- --mode=initial --env=staging
```

## Monitoring

### Health Checks

- **Liveness**: `GET /health`
- **Readiness**: `GET /ready`

### Metrics

Prometheus metrics available at `/metrics`:
- Request latency histograms
- Error rate counters
- Cache hit/miss ratios
- Database connection pool metrics

### Logging

Structured JSON logs with correlation IDs:
```json
{
  "timestamp": "2024-01-15T10:00:00Z",
  "level": "info",
  "message": "Menu item created",
  "service": "menu-service",
  "menuItemId": "menu-123",
  "restaurantId": "rest-456"
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Run linter and tests
5. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: [docs/](./docs/)
- **Issues**: https://github.com/bookabite/menu-service/issues
- **Slack**: #menu-service channel
