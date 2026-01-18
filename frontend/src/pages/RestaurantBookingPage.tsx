import { Box, Container, Grid, GridItem, VStack, Spinner, Center, Text, Button } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import BookingHero from "../components/booking/BookingHero";
import BookingForm from "../components/booking/BookingForm";
import BookingOverview from "../components/booking/BookingOverview";
import RestaurantDataGrid from "../components/booking/RestaurantDataGrid";
import VenueGallery from "../components/booking/VenueGallery";
import MenuCarousel from "../components/booking/MenuCarousel";
import {
  galleryImages,
  menuItems,
  restaurantDataBlocks,
} from "../components/booking/bookingData";
import type { FoodItem, FormData } from "../components/booking/types";
import { useRestaurantBooking } from "../hooks/useRestaurantBooking";

const RestaurantBookingPage = () => {
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("id");
  
  const { restaurant, isLoading, error } = useRestaurantBooking(restaurantId);

  const [formData, setFormData] = useState<FormData>({
    guestName: "",
    phone: "",
    email: "",
    guests: "2",
    date: "",
    time: "",
    requests: "",
  });

  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoodToggle = (item: FoodItem) => {
    setSelectedFoods((prev) => {
      const exists = prev.some((food) => food.id === item.id);
      return exists
        ? prev.filter((food) => food.id !== item.id)
        : [...prev, item];
    });
  };

  const totalFoodCost = useMemo(
    () => selectedFoods.reduce((sum, item) => sum + item.price, 0),
    [selectedFoods]
  );

  const handleSubmit = () => {
    console.table({
      ...formData,
      restaurantId,
      restaurantName: restaurant?.name,
      selectedFoods: selectedFoods
        .map((food) => `${food.name} ($${food.price})`)
        .join(", "),
      totalFoodCost,
    });
    alert("Reservation draft saved! (Demo only)");
  };

  // Prepare restaurant gallery images
  const restaurantGalleryImages = useMemo(() => {
    if (!restaurant) return galleryImages;
    
    const images = [];
    
    // Add main image first
    if (restaurant.mainImage) {
      images.push({
        id: 1,
        url: restaurant.mainImage,
        caption: `${restaurant.name} - Main View`
      });
    }
    
    // Add gallery images if available
    if (restaurant.galleryImages && restaurant.galleryImages.length > 0) {
      restaurant.galleryImages.forEach((url, index) => {
        images.push({
          id: index + 2,
          url: url,
          caption: `${restaurant.name} - Gallery ${index + 1}`
        });
      });
    }
    
    // Fallback to dummy images if no images available
    return images.length > 0 ? images : galleryImages;
  }, [restaurant]);

  // Loading state
  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Center>
          <VStack gap={4}>
            <Spinner size="xl" color="#0ea5e9" />
            <Text color="gray.600">Loading restaurant details...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Error state
  if (error || !restaurant) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Center>
          <VStack gap={4} textAlign="center">
            <Text color="red.500" fontSize="lg" fontWeight="600">
              {error || "Restaurant not found"}
            </Text>
            <Text color="gray.600">
              {!restaurantId 
                ? "Please select a restaurant from the listing page."
                : "The restaurant you're looking for doesn't exist."}
            </Text>
            <Button
              colorScheme="cyan"
              onClick={() => window.location.href = "/restaurants"}
            >
              Browse Restaurants
            </Button>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box bgGradient="linear(to-b, #f0f9ff, #fff)" pb={16}>
      <Container maxW="1200px" px={{ base: 4, md: 6 }} py={{ base: 8, md: 14 }}>
        <VStack align="stretch" gap={{ base: 8, md: 12 }}>
          <BookingHero restaurant={restaurant} />

          <RestaurantDataGrid data={restaurantDataBlocks} />

          <Grid
            templateColumns={{
              base: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
            }}
            gap={{ base: 6, md: 12 }}
            alignItems="stretch"
          >
            <VenueGallery images={restaurantGalleryImages} />
            <MenuCarousel
              items={menuItems}
              selectedFoods={selectedFoods}
              onToggleFood={handleFoodToggle}
            />
          </Grid>

          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={{ base: 6, md: 10 }}
            alignItems="start"
          >
            <GridItem>
              <BookingForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            </GridItem>
            <GridItem>
              <BookingOverview
                formData={formData}
                selectedFoods={selectedFoods}
                totalFoodCost={totalFoodCost}
              />
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default RestaurantBookingPage;
