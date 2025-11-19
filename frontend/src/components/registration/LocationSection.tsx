/** @jsxImportSource @emotion/react */
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuMapPin } from "react-icons/lu";
import type { RegistrationFormData } from "./types";

type LocationSectionProps = {
  formData: RegistrationFormData;
  onInputChange: (field: keyof RegistrationFormData, value: any) => void;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LocationSection = ({ formData, onInputChange }: LocationSectionProps) => {
  const handleMapPinClick = () => {
    // In a real app, this would open a map picker or use geolocation API
    // For now, we'll use placeholder coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onInputChange("latitude", position.coords.latitude.toString());
          onInputChange("longitude", position.coords.longitude.toString());
        },
        () => {
          // Fallback to manual entry or default
          alert("Please enter coordinates manually or allow location access");
        }
      );
    } else {
      alert("Geolocation is not supported. Please enter coordinates manually.");
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="24px"
      p={{ base: 6, md: 8 }}
      boxShadow="0 10px 30px rgba(14,165,233,0.1)"
      css={css`
        animation: ${fadeIn} 0.5s ease-out;
      `}
    >
      <Heading fontSize="1.75rem" mb={6} color="#0f172a">
        Location
      </Heading>

      <VStack gap={5} align="stretch">
        <Box>
          <Text fontWeight="600" mb={2}>Address *</Text>
          <Input
            placeholder="Street address"
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            borderRadius="12px"
          />
        </Box>

        <Stack direction={{ base: "column", md: "row" }} gap={4}>
          <Box flex="1">
            <Text fontWeight="600" mb={2}>City *</Text>
            <Input
              placeholder="City"
              value={formData.city}
              onChange={(e) => onInputChange("city", e.target.value)}
              borderRadius="12px"
            />
          </Box>
          <Box flex="1">
            <Text fontWeight="600" mb={2}>Pincode *</Text>
            <Input
              placeholder="123456"
              value={formData.pincode}
              onChange={(e) => onInputChange("pincode", e.target.value)}
              borderRadius="12px"
            />
          </Box>
        </Stack>

        <Box>
          <Text fontWeight="600" mb={3}>Google Map Pin *</Text>
          <Stack direction={{ base: "column", md: "row" }} gap={3}>
            <Box flex="1">
              <Text fontSize="sm" color="gray.600" mb={1}>Latitude</Text>
              <Input
                placeholder="e.g., 28.6139"
                value={formData.latitude}
                onChange={(e) => onInputChange("latitude", e.target.value)}
                borderRadius="12px"
              />
            </Box>
            <Box flex="1">
              <Text fontSize="sm" color="gray.600" mb={1}>Longitude</Text>
              <Input
                placeholder="e.g., 77.2090"
                value={formData.longitude}
                onChange={(e) => onInputChange("longitude", e.target.value)}
                borderRadius="12px"
              />
            </Box>
          </Stack>
          <Button
            mt={3}
            colorScheme="cyan"
            variant="outline"
            onClick={handleMapPinClick}
            borderRadius="12px"
            width={{ base: "100%", md: "auto" }}
          >
            <HStack gap={2}>
              <LuMapPin />
              <Text>Use Current Location</Text>
            </HStack>
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default LocationSection;

