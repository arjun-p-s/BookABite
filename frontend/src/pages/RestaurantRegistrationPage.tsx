import { Box, Button, Container, VStack, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BasicInfoSection from "../components/registration/BasicInfoSection";
import BookingDetailsSection from "../components/registration/BookingDetailsSection";
import LocationSection from "../components/registration/LocationSection";
import OperationalDetailsSection from "../components/registration/OperationalDetailsSection";
import OwnerDetailsSection from "../components/registration/OwnerDetailsSection";
import RegistrationHero from "../components/registration/RegistrationHero";
import { daysOfWeek } from "../components/registration/registrationData";
import type {
  RegistrationFormData,
  RestaurantRegistrationPayload,
} from "../components/registration/types";

const RestaurantRegistrationPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

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

  const handleInputChange = (
    field: keyof RegistrationFormData,
    value: string | string[] | File | File[] | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadFileToCloudinary = async (file: File, token: string) => {
    const uploadData = new FormData();
    uploadData.append("file", file);

    const response = await axios.post("http://localhost:3002/uploads", uploadData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data.url as string;
  };

  const showAlert = (message: string, type: "success" | "error" | "warning") => {
    // Create a custom alert with better styling
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 9999;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
      max-width: 400px;
      ${type === "success" ? "background: #10b981; color: white;" : ""}
      ${type === "error" ? "background: #ef4444; color: white;" : ""}
      ${type === "warning" ? "background: #f59e0b; color: white;" : ""}
    `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.style.animation = "slideOut 0.3s ease";
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("Please login first to register a restaurant.", "error");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress("Preparing files...");

    try {
      // Upload logo
      setUploadProgress("Uploading logo...");
      const logoImageUrl = formData.logoImage
        ? await uploadFileToCloudinary(formData.logoImage, token)
        : null;

      // Upload gallery images
      setUploadProgress(`Uploading gallery images (${formData.galleryImages.length} files)...`);
      const galleryImageUrls = await Promise.all(
        formData.galleryImages.map((image) => uploadFileToCloudinary(image, token))
      );

      // Upload owner ID proof
      setUploadProgress("Uploading owner ID proof...");
      const ownerIdProofUrl = formData.ownerIdProof
        ? await uploadFileToCloudinary(formData.ownerIdProof, token)
        : null;

      const mainImageUrl = logoImageUrl || galleryImageUrls[0] || ownerIdProofUrl;

      if (!mainImageUrl) {
        showAlert("Please upload at least one image (logo or gallery) for the restaurant.", "warning");
        setIsSubmitting(false);
        setUploadProgress("");
        return;
      }

      const workingSchedule = daysOfWeek.map((day) => ({
        day: day.label,
        isOpen: formData.daysOpen.includes(day.value),
      }));

      const payload: RestaurantRegistrationPayload = {
        name: formData.restaurantName,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        mainImage: mainImageUrl,
        galleryImages: galleryImageUrls,
        workingSchedule,
        timeSchedule: {
          openTime: formData.openingTime,
          closeTime: formData.closingTime,
        },
        cuisineType: formData.cuisineTypes,
        specialTags: formData.tags,
        totalCapacity: Number(formData.totalSeatingCapacity) || 0,
        tableTypes: formData.tableTypes.map((table) => ({
          seats: Number(table.capacity) || 0,
          count: Number(table.count) || 0,
        })),
        maxBookingPerSlot: Number(formData.maxBookingPerSlot) || 10,
        address: {
          street: formData.address,
          city: formData.city,
          state: "",
          country: "",
          pincode: formData.pincode,
        },
        geoCoordinates: {
          lat: Number(formData.latitude) || 0,
          lng: Number(formData.longitude) || 0,
        },
        ownerName: formData.ownerName,
        ownerIdProof: ownerIdProofUrl,
        accountStatus: "pending",
        isVerified: false,
      };

      setUploadProgress("Submitting registration...");
      await axios.post("http://localhost:3002/restaurants/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      showAlert("Restaurant registered successfully! 🎉 Redirecting...", "success");

      // Small delay to show success message
      setTimeout(() => {
        navigate("/restaurants");
      }, 1500);

    } catch (error) {
      console.error(error);
      showAlert("Registration failed! Please try again.", "error");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
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
                transform: isSubmitting ? "none" : "translateY(-2px)",
                boxShadow: "0 12px 30px rgba(14,165,233,0.35)",
              }}
              onClick={handleSubmit}
              borderRadius="12px"
              fontWeight="700"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? (
                <Box display="flex" alignItems="center" gap={3}>
                  <Spinner size="sm" />
                  <Text>{uploadProgress || "Processing..."}</Text>
                </Box>
              ) : (
                "Submit Registration"
              )}
            </Button>
            
            {isSubmitting && (
              <Text 
                textAlign="center" 
                mt={3} 
                fontSize="sm" 
                color="gray.600"
              >
                Please wait, this may take a moment...
              </Text>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default RestaurantRegistrationPage;