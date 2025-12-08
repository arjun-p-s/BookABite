import axios, { AxiosInstance } from 'axios';
import { Logger } from '../observability/logger';

/**
 * FoodItem interface from FoodItem Service
 */
export interface FoodItem {
    id: string;
    name: string;
    description?: string;
    basePrice: number;
    currency: string;
    images?: string[];
    tags?: string[];
    cuisine?: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * FoodItem Service Client
 * Handles communication with FoodItem Service
 */
export class FoodItemService {
    private client: AxiosInstance;
    private logger = Logger.getInstance();

    constructor() {
        this.client = axios.create({
            baseURL: process.env.FOODITEM_SERVICE_URL || 'http://localhost:3002',
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor for logging
        this.client.interceptors.request.use(
            (config) => {
                this.logger.debug('FoodItem Service request', {
                    method: config.method,
                    url: config.url,
                });
                return config;
            },
            (error) => {
                this.logger.error('FoodItem Service request error', { error });
                return Promise.reject(error);
            }
        );

        // Response interceptor for logging
        this.client.interceptors.response.use(
            (response) => {
                this.logger.debug('FoodItem Service response', {
                    status: response.status,
                    url: response.config.url,
                });
                return response;
            },
            (error) => {
                this.logger.error('FoodItem Service response error', {
                    status: error.response?.status,
                    message: error.message,
                    url: error.config?.url,
                });
                return Promise.reject(error);
            }
        );
    }

    /**
     * Get a food item by ID
     */
    async getFoodItem(foodItemId: string): Promise<FoodItem | null> {
        try {
            const response = await this.client.get<{ data: FoodItem }>(
                `/v1/fooditems/${foodItemId}`
            );
            return response.data.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Get multiple food items by IDs
     */
    async getFoodItems(foodItemIds: string[]): Promise<FoodItem[]> {
        try {
            const response = await this.client.post<{ data: FoodItem[] }>(
                '/v1/fooditems/batch',
                { ids: foodItemIds }
            );
            return response.data.data;
        } catch (error) {
            this.logger.error('Failed to fetch food items', { error, foodItemIds });
            throw error;
        }
    }

    /**
     * Validate that a food item exists
     */
    async validateFoodItem(foodItemId: string): Promise<boolean> {
        const foodItem = await this.getFoodItem(foodItemId);
        return foodItem !== null;
    }
}
