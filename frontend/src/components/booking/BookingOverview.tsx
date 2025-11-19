import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import type { FoodItem, FormData } from "./types";

type BookingOverviewProps = {
  formData: FormData;
  selectedFoods: FoodItem[];
  totalFoodCost: number;
};

const BookingOverview = ({ formData, selectedFoods, totalFoodCost }: BookingOverviewProps) => (
  <Box
    bg="white"
    borderRadius="24px"
    p={{ base: 6, md: 8 }}
    boxShadow="0 18px 50px rgba(148,163,184,0.2)"
    position={{ base: "static", md: "sticky" }}
    top={{ md: "120px" }}
  >
    <Heading fontSize="1.5rem" mb={6} color="#0f172a">
      Booking Overview
    </Heading>
    <VStack align="stretch" gap={4}>
      <Box>
        <Text fontSize="sm" color="gray.500">
          Party Size
        </Text>
        <Text fontWeight="600" fontSize="xl">
          {formData.guests} Guests · {formData.time || "Select time"}
        </Text>
      </Box>
      <Box height="1px" bg="rgba(15,23,42,0.08)" />
      <Box>
        <Text fontSize="sm" color="gray.500">
          Selected Add-ons
        </Text>
        {selectedFoods.length === 0 ? (
          <Text color="gray.600" mt={2}>
            Tap on dishes below to pre-order and delight your guests.
          </Text>
        ) : (
          <VStack align="stretch" gap={3} mt={2}>
            {selectedFoods.map((food) => (
              <HStack key={food.id} justify="space-between">
                <Text fontWeight="600">{food.name}</Text>
                <Text color="#0ea5e9">${food.price.toFixed(2)}</Text>
              </HStack>
            ))}
          </VStack>
        )}
      </Box>
      <Box height="1px" bg="rgba(15,23,42,0.08)" />
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="600">
          Estimated Add-on Total
        </Text>
        <Text fontSize="xl" color="#14b8a6" fontWeight="700">
          ${totalFoodCost.toFixed(2)}
        </Text>
      </HStack>
    </VStack>
  </Box>
);

export default BookingOverview;

