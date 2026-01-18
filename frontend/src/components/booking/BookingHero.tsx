/** @jsxImportSource @emotion/react */
import { Badge, Box, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";

const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(14, 165, 233, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
  }
`;

type Restaurant = {
  name: string;
  description?: string;
  cuisineType?: string[];
};

type BookingHeroProps = {
  restaurant: Restaurant;
};

const BookingHero = ({ restaurant }: BookingHeroProps) => (
  <Box
    bg="white"
    borderRadius="24px"
    p={{ base: 6, md: 10 }}
    boxShadow="0 20px 60px rgba(14,165,233,0.12)"
    css={css`
      animation: ${floatUp} 0.6s ease-out;
    `}
  >
    <Stack direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 10 }} align="center">
      <VStack align="flex-start" gap={4} flex="1">
        <Badge colorScheme="cyan" borderRadius="full" px={4} py={1} fontSize="0.85rem">
          Premium Restaurant Booking
        </Badge>
        <Heading fontSize={{ base: "2.25rem", md: "3rem" }} color="#0f172a" letterSpacing="-1px" lineHeight="1.1">
          {restaurant.name}
        </Heading>
        <Text fontSize="lg" color="gray.600">
          {restaurant.description || "Streamlined reservations with live inventory visibility, curated menu previews, and seamless add-on ordering."}
        </Text>
        <HStack gap={4}>
          <Badge bg="rgba(14,165,233,0.1)" color="#0ea5e9" px={3} py={1}>
            Live Availability
          </Badge>
          {restaurant.cuisineType && restaurant.cuisineType.length > 0 && (
            <Badge bg="rgba(16,185,129,0.1)" color="#10b981" px={3} py={1}>
              {restaurant.cuisineType[0]}
            </Badge>
          )}
        </HStack>
      </VStack>
      <Box
        bgGradient="linear(135deg, #0ea5e9, #14b8a6)"
        borderRadius="20px"
        p={6}
        color="white"
        flexBasis={{ base: "100%", md: "40%" }}
        textAlign="center"
        css={css`
          animation: ${pulseGlow} 2.5s ease-out infinite;
        `}
      >
        <Text fontSize="sm" opacity={0.85}>
          Next Available Slot
        </Text>
        <Heading fontSize="2.75rem" mt={2}>
          07:30 PM
        </Heading>
        <Text fontSize="lg" mt={2} fontWeight="600">
          Today · Rooftop Lounge
        </Text>
        <Text mt={4} fontSize="sm">
          5 tables left for prime sunset dining
        </Text>
      </Box>
    </Stack>
  </Box>
);

export default BookingHero;

