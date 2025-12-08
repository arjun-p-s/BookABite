# Menu Service API Documentation

## Overview

The Menu Service provides RESTful APIs for managing restaurant-specific menu data. All endpoints require authentication via JWT tokens.

## Base URL

```
Production: https://api.bookabite.com/menu/v1
Staging: https://staging-api.bookabite.com/menu/v1
Development: http://localhost:3000/v1
```

## Authentication

All requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Get Restaurant Menu

Retrieve all menu items for a specific restaurant.

```http
GET /v1/restaurants/:restaurantId/menu
```

**Query Parameters:**
- `availableOnly` (boolean, optional): Filter for available items only
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 50, max: 100)
- `sortBy` (string, optional): Sort field (default: "title")
- `sortOrder` (string, optional): "asc" or "desc" (default: "asc")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "menu-123",
      "restaurantId": "rest-456",
      "foodItemId": "food-789",
      "title": "Margherita Pizza",
      "description": "Classic Italian pizza",
      "price": 12.99,
      "currency": "USD",
      "images": ["https://cdn.example.com/pizza.jpg"],
      "available": true,
      "variants": [
        {
          "variantId": "var-1",
          "name": "Large",
          "priceDelta": 3.00
        }
      ],
      "addons": [
        {
          "addonId": "addon-1",
          "name": "Extra Cheese",
          "price": 2.00
        }
      ],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

---

### Get Single Menu Item

```http
GET /v1/restaurants/:restaurantId/menu/:menuItemId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "menu-123",
    "restaurantId": "rest-456",
    "foodItemId": "food-789",
    "title": "Margherita Pizza",
    "price": 12.99,
    "currency": "USD",
    "available": true
  }
}
```

---

### Create Menu Item

```http
POST /v1/restaurants/:restaurantId/menu
```

**Request Body:**
```json
{
  "foodItemId": "food-789",
  "title": "Margherita Pizza",
  "description": "Classic Italian pizza",
  "price": 12.99,
  "currency": "USD",
  "images": ["https://cdn.example.com/pizza.jpg"],
  "available": true,
  "variants": [
    {
      "variantId": "var-1",
      "name": "Large",
      "priceDelta": 3.00
    }
  ],
  "addons": [
    {
      "addonId": "addon-1",
      "name": "Extra Cheese",
      "price": 2.00
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "menu-123",
    "restaurantId": "rest-456",
    "foodItemId": "food-789",
    "title": "Margherita Pizza",
    "price": 12.99,
    "available": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### Update Menu Item

```http
PATCH /v1/restaurants/:restaurantId/menu/:menuItemId
```

**Headers:**
- `If-Match`: Version number for optimistic locking (optional)

**Request Body:**
```json
{
  "title": "Updated Pizza Name",
  "price": 14.99,
  "available": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "menu-123",
    "title": "Updated Pizza Name",
    "price": 14.99,
    "available": false,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### Delete Menu Item

```http
DELETE /v1/restaurants/:restaurantId/menu/:menuItemId
```

**Response:**
```
204 No Content
```

---

### Search Menu

```http
GET /v1/search?restaurantId=rest-456&query=pizza
```

**Query Parameters:**
- `restaurantId` (string, required): Restaurant ID
- `query` (string, required): Search query

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "menu-123",
      "title": "Margherita Pizza",
      "price": 12.99
    }
  ]
}
```

---

### Get Restaurants by Food Item

```http
GET /v1/fooditems/:foodItemId/menus
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "menu-123",
      "restaurantId": "rest-456",
      "foodItemId": "food-789",
      "title": "Margherita Pizza",
      "price": 12.99,
      "available": true
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `MENU_ITEM_NOT_FOUND` | 404 | Menu item not found |
| `FOOD_ITEM_NOT_FOUND` | 404 | Referenced food item not found |
| `DUPLICATE_MENU_ITEM` | 409 | Menu item already exists |
| `OPTIMISTIC_LOCK_CONFLICT` | 409 | Version conflict (concurrent update) |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

- **Limit**: 1000 requests per hour per user
- **Headers**: 
  - `X-RateLimit-Limit`: Total limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Caching

Responses include ETag headers for caching:

```http
ETag: "abc123def456"
```

Use `If-None-Match` header to check for updates:

```http
If-None-Match: "abc123def456"
```

Returns `304 Not Modified` if unchanged.

---

## Events Published

The Menu Service publishes the following events to Kafka:

### MenuItem.Created
```json
{
  "specversion": "1.0",
  "type": "com.bookabite.menu.item.created.v1",
  "source": "menu-service",
  "id": "event-uuid",
  "time": "2024-01-15T10:00:00Z",
  "data": {
    "menuItemId": "menu-123",
    "restaurantId": "rest-456",
    "foodItemId": "food-789",
    "title": "Margherita Pizza",
    "price": 12.99,
    "available": true
  }
}
```

### MenuItem.Updated
### MenuItem.Deleted
### MenuItem.AvailabilityChanged

All events follow the CloudEvents specification.
