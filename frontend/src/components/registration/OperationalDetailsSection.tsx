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
import { useState } from "react";
import { LuPlus, LuX } from "react-icons/lu";
import { cuisineOptions, daysOfWeek, popularTags } from "./registrationData";
import type { RegistrationFormData } from "./types";

type OperationalDetailsSectionProps = {
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

const OperationalDetailsSection = ({
  formData,
  onInputChange,
}: OperationalDetailsSectionProps) => {
  const [customTag, setCustomTag] = useState("");

  const toggleDay = (day: string) => {
    const newDays = formData.daysOpen.includes(day)
      ? formData.daysOpen.filter((d) => d !== day)
      : [...formData.daysOpen, day];
    onInputChange("daysOpen", newDays);
  };

  const toggleCuisine = (cuisine: string) => {
    const newCuisines = formData.cuisineTypes.includes(cuisine)
      ? formData.cuisineTypes.filter((c) => c !== cuisine)
      : [...formData.cuisineTypes, cuisine];
    onInputChange("cuisineTypes", newCuisines);
  };

  const toggleTag = (tag: string) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter((t) => t !== tag)
      : [...formData.tags, tag];
    onInputChange("tags", newTags);
  };

  const addCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      onInputChange("tags", [...formData.tags, customTag.trim()]);
      setCustomTag("");
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
        Operational Details
      </Heading>

      <VStack gap={6} align="stretch">
        <Box>
          <Text fontWeight="600" mb={3}>Days Open *</Text>
          <Stack direction={{ base: "column", sm: "row" }} gap={3} flexWrap="wrap">
            {daysOfWeek.map((day) => (
              <Button
                key={day.value}
                size="sm"
                variant={formData.daysOpen.includes(day.value) ? "solid" : "outline"}
                colorScheme={formData.daysOpen.includes(day.value) ? "cyan" : "gray"}
                onClick={() => toggleDay(day.value)}
                borderRadius="full"
                fontWeight="normal"
              >
                {day.label}
              </Button>
            ))}
          </Stack>
        </Box>

        <Stack direction={{ base: "column", md: "row" }} gap={4}>
          <Box flex="1">
            <Text fontWeight="600" mb={2}>Opening Time *</Text>
            <Input
              type="time"
              value={formData.openingTime}
              onChange={(e) => onInputChange("openingTime", e.target.value)}
              borderRadius="12px"
            />
          </Box>
          <Box flex="1">
            <Text fontWeight="600" mb={2}>Closing Time *</Text>
            <Input
              type="time"
              value={formData.closingTime}
              onChange={(e) => onInputChange("closingTime", e.target.value)}
              borderRadius="12px"
            />
          </Box>
        </Stack>

        <Box>
          <Text fontWeight="600" mb={3}>Cuisine Type *</Text>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {cuisineOptions.map((cuisine) => (
              <Button
                key={cuisine.value}
                size="sm"
                variant={formData.cuisineTypes.includes(cuisine.value) ? "solid" : "outline"}
                colorScheme={formData.cuisineTypes.includes(cuisine.value) ? "cyan" : "gray"}
                onClick={() => toggleCuisine(cuisine.value)}
                borderRadius="full"
              >
                {cuisine.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box>
          <Text fontWeight="600" mb={3}>Tags (Optional)</Text>
          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            {popularTags.map((tag) => (
              <Button
                key={tag}
                size="sm"
                variant={formData.tags.includes(tag) ? "solid" : "outline"}
                colorScheme={formData.tags.includes(tag) ? "teal" : "gray"}
                onClick={() => toggleTag(tag)}
                borderRadius="full"
              >
                {tag}
              </Button>
            ))}
          </Box>
          {formData.tags.length > 0 && (
            <Box mb={3}>
              <Text fontSize="sm" color="gray.600" mb={2}>Selected Tags:</Text>
              <HStack gap={2} flexWrap="wrap">
                {formData.tags.map((tag) => (
                  <Button
                    key={tag}
                    size="xs"
                    onClick={() => toggleTag(tag)}
                    borderRadius="full"
                    bg="rgba(14,165,233,0.1)"
                    color="#0ea5e9"
                  >
                    <HStack gap={1}>
                      <Text>{tag}</Text>
                      <LuX size={12} />
                    </HStack>
                  </Button>
                ))}
              </HStack>
            </Box>
          )}
          <HStack gap={2}>
            <Input
              placeholder="Add custom tag"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
              borderRadius="12px"
              size="sm"
            />
            <Button
              onClick={addCustomTag}
              colorScheme="cyan"
              borderRadius="12px"
              size="sm"
            >
              <HStack gap={2}>
                <LuPlus size={16} />
                <Text>Add</Text>
              </HStack>
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default OperationalDetailsSection;

