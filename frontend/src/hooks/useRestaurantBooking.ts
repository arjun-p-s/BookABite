import { useState, useEffect } from "react";
import { restaurantApi } from "../api/adminApi";

type Restaurant = {
    _id: string;
    name: string;
    description: string;
    mainImage: string;
    galleryImages?: string[];
    cuisineType: string[];
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    rating?: number;
    reviews?: number;
    priceRange?: string;
    seatingCapacity?: {
        twoSeat?: number;
        fourSeat?: number;
        sixSeat?: number;
    };
    operatingHours?: {
        open: string;
        close: string;
        lastSeating?: string;
    };
};

type UseRestaurantBookingReturn = {
    restaurant: Restaurant | null;
    isLoading: boolean;
    error: string | null;
};

export const useRestaurantBooking = (restaurantId: string | null): UseRestaurantBookingReturn => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!restaurantId) {
                setError("No restaurant ID provided");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await restaurantApi.getById(restaurantId);
                setRestaurant(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching restaurant:", err);
                setError("Failed to load restaurant details. Please try again.");
                setRestaurant(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurant();
    }, [restaurantId]);

    return { restaurant, isLoading, error };
};
