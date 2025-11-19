import { Box, Container, Grid, GridItem, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
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

const RestaurantBookingPage = () => {
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
      selectedFoods: selectedFoods
        .map((food) => `${food.name} ($${food.price})`)
        .join(", "),
      totalFoodCost,
    });
    alert("Reservation draft saved! (Demo only)");
  };

  return (
    <Box bgGradient="linear(to-b, #f0f9ff, #fff)" pb={16}>
      <Container maxW="1200px" px={{ base: 4, md: 6 }} py={{ base: 8, md: 14 }}>
        <VStack align="stretch" gap={{ base: 8, md: 12 }}>
          <BookingHero />

          <RestaurantDataGrid data={restaurantDataBlocks} />

          <Grid
            templateColumns={{
              base: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
            }}
            gap={{ base: 6, md: 12 }}
            alignItems="stretch"
          >
            <VenueGallery images={galleryImages} />
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
