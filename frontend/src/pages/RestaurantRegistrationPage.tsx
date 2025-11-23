import { Box, Container, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfoSection from "../components/registration/BasicInfoSection";
import BookingDetailsSection from "../components/registration/BookingDetailsSection";
import LocationSection from "../components/registration/LocationSection";
import OperationalDetailsSection from "../components/registration/OperationalDetailsSection";
import OwnerDetailsSection from "../components/registration/OwnerDetailsSection";
import RegistrationHero from "../components/registration/RegistrationHero";
import SubmitButton from "../components/registration/SubmitButton";
import LoadingState from "../components/registration/LoadingState";
import { useRestaurantForm } from "../hooks/useRestaurantForm";
import type { RegistrationFormData } from "../components/registration/types";

const RestaurantRegistrationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

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

  const {
    isLoading,
    isSubmitting,
    uploadProgress,
    fetchRestaurantData,
    handleSubmit,
  } = useRestaurantForm(formData, setFormData, isEditMode, id);

  useEffect(() => {
    if (isEditMode && id) {
      fetchRestaurantData(id, navigate);
    }
  }, [id, isEditMode]);

  const handleInputChange = (
    field: keyof RegistrationFormData,
    value: string | string[] | File | File[] | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

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

          <SubmitButton
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
            uploadProgress={uploadProgress}
            onSubmit={() => handleSubmit(navigate)}
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default RestaurantRegistrationPage;