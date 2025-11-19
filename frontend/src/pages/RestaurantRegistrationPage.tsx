import { Box, Button, Container, VStack } from "@chakra-ui/react";
import { useState } from "react";
import BasicInfoSection from "../components/registration/BasicInfoSection";
import BookingDetailsSection from "../components/registration/BookingDetailsSection";
import LocationSection from "../components/registration/LocationSection";
import OperationalDetailsSection from "../components/registration/OperationalDetailsSection";
import OwnerDetailsSection from "../components/registration/OwnerDetailsSection";
import RegistrationHero from "../components/registration/RegistrationHero";
import type { RegistrationFormData } from "../components/registration/types";

const RestaurantRegistrationPage = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    restaurantName: "",
    email: "",
    phone: "",
    description: "",
    logoImage: null,
    galleryImages: [],
    daysOpen: [],
    openingTime: "",
    closingTime: "",
    cuisineTypes: [],
    tags: [],
    totalSeatingCapacity: "",
    tableTypes: [],
    maxBookingPerSlot: "",
    address: "",
    city: "",
    pincode: "",
    latitude: "",
    longitude: "",
    ownerName: "",
    ownerIdProof: null,
  });

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.table(formData);
    alert("Registration submitted! (Demo only)");
    // In a real app, you would send this to your backend API
    // navigate("/restaurants");
  };

  return (
    <Box bgGradient="linear(to-b, #f0f9ff, #fff)" minH="100vh" pb={16}>
      <RegistrationHero />
      <Container maxW="1000px" px={{ base: 4, md: 6 }} py={{ base: 8, md: 12 }}>
        <VStack gap={{ base: 6, md: 8 }} align="stretch">
          <BasicInfoSection formData={formData} onInputChange={handleInputChange} />
          <OperationalDetailsSection formData={formData} onInputChange={handleInputChange} />
          <BookingDetailsSection formData={formData} onInputChange={handleInputChange} />
          <LocationSection formData={formData} onInputChange={handleInputChange} />
          <OwnerDetailsSection formData={formData} onInputChange={handleInputChange} />

          <Box
            bg="white"
            borderRadius="24px"
            p={{ base: 6, md: 8 }}
            boxShadow="0 10px 30px rgba(14,165,233,0.1)"
            position="sticky"
            bottom={0}
            zIndex={10}
          >
            <Button
              width="100%"
              size="lg"
              bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, #14b8a6, #10b981)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 30px rgba(14,165,233,0.35)",
              }}
              onClick={handleSubmit}
              borderRadius="12px"
              fontWeight="700"
            >
              Submit Registration
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default RestaurantRegistrationPage;

