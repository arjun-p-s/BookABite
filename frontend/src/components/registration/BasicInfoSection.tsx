/** @jsxImportSource @emotion/react */
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { useRef, useState } from "react";
import { LuImage, LuUpload, LuX } from "react-icons/lu";
import type { RegistrationFormData } from "./types";

type BasicInfoSectionProps = {
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

const BasicInfoSection = ({ formData, onInputChange }: BasicInfoSectionProps) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onInputChange("logoImage", file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...formData.galleryImages, ...files];
      onInputChange("galleryImages", newFiles);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = formData.galleryImages.filter((_, i) => i !== index);
    onInputChange("galleryImages", newImages);
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
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
        Basic Information
      </Heading>

      <VStack gap={5} align="stretch">
        <Stack direction={{ base: "column", md: "row" }} gap={4}>
          <Box flex="1">
            <Text fontWeight="600" mb={2}>Restaurant Name *</Text>
            <Input
              placeholder="Enter restaurant name"
              value={formData.restaurantName}
              onChange={(e) => onInputChange("restaurantName", e.target.value)}
              borderRadius="12px"
            />
          </Box>
          <Box flex="1">
            <Text fontWeight="600" mb={2}>Email *</Text>
            <Input
              type="email"
              placeholder="restaurant@email.com"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              borderRadius="12px"
            />
          </Box>
        </Stack>

        <Box>
          <Text fontWeight="600" mb={2}>Phone *</Text>
          <Input
            type="tel"
            placeholder="+1 987 456 1230"
            value={formData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
            borderRadius="12px"
          />
        </Box>

        <Box>
          <Text fontWeight="600" mb={2}>Description *</Text>
          <Textarea
            placeholder="Tell us about your restaurant..."
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            rows={4}
            borderRadius="12px"
          />
        </Box>

        <Box>
          <Text fontWeight="600" mb={3}>Logo Image *</Text>
          <Box
            border="2px dashed rgba(14,165,233,0.3)"
            borderRadius="16px"
            p={6}
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: "#0ea5e9", bg: "rgba(14,165,233,0.05)" }}
            transition="all 0.3s ease"
            onClick={() => logoInputRef.current?.click()}
          >
            {logoPreview ? (
              <Box position="relative" display="inline-block">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  style={{ maxHeight: "120px", borderRadius: "12px" }}
                />
                <Button
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  size="sm"
                  borderRadius="full"
                  bg="red.500"
                  color="white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogoPreview(null);
                    onInputChange("logoImage", null);
                  }}
                >
                  <LuX />
                </Button>
              </Box>
            ) : (
              <VStack gap={2}>
                <LuUpload size={32} color="#0ea5e9" />
                <Text color="gray.600">Click to upload logo</Text>
              </VStack>
            )}
            <Input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              display="none"
              onChange={handleLogoUpload}
            />
          </Box>
        </Box>

        <Box>
          <Text fontWeight="600" mb={3}>Gallery Images</Text>
          <Box
            border="2px dashed rgba(14,165,233,0.3)"
            borderRadius="16px"
            p={6}
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: "#0ea5e9", bg: "rgba(14,165,233,0.05)" }}
            transition="all 0.3s ease"
            onClick={() => galleryInputRef.current?.click()}
          >
            <VStack gap={3}>
              <LuImage size={32} color="#0ea5e9" />
              <Text color="gray.600">Click to upload gallery images</Text>
              {galleryPreviews.length > 0 && (
                <Box display="flex" gap={2} flexWrap="wrap" mt={4}>
                  {galleryPreviews.map((preview, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={preview}
                        alt={`Gallery ${index + 1}`}
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                      />
                      <Button
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        size="xs"
                        borderRadius="full"
                        bg="red.500"
                        color="white"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGalleryImage(index);
                        }}
                      >
                        <LuX size={12} />
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </VStack>
            <Input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              display="none"
              onChange={handleGalleryUpload}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default BasicInfoSection;

