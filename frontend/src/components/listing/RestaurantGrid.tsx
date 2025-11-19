import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { LuMapPin, LuStar } from "react-icons/lu";
import type { RestaurantListing } from "./listingData";

type RestaurantGridProps = {
  restaurants: RestaurantListing[];
};

const hoverRise = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-6px); }
`;

const RestaurantGrid = ({ restaurants }: RestaurantGridProps) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 5, md: 6 }}>
      {restaurants.map((restaurant) => (
        <Box
          key={restaurant.id}
          borderRadius="28px"
          overflow="hidden"
          border="1px solid rgba(15,23,42,0.08)"
          bg="white"
          boxShadow="0 16px 40px rgba(15,23,42,0.12)"
          display="flex"
          flexDirection="column"
          animation={`${hoverRise} 0.4s ease backwards`}
          _hover={{ transform: "translateY(-6px)" }}
        >
          <Box
            h={{ base: "200px", md: "220px" }}
            backgroundImage={`url(${restaurant.image})`}
            backgroundSize="cover"
            backgroundPosition="center"
          />

          <Box p={{ base: 5, md: 6 }} display="flex" flexDirection="column" flex="1">
            <HStack justify="space-between" align="flex-start" mb={3} gap={3}>
              <Heading fontSize={{ base: "xl", md: "1.35rem" }} color="#0f172a">
                {restaurant.name}
              </Heading>
              <Badge colorScheme="cyan" borderRadius="full">
                {restaurant.cuisine}
              </Badge>
            </HStack>

            <Text color="gray.600" fontSize="sm" mb={3} flex="1">
              {restaurant.description}
            </Text>

            <Flex justify="space-between" align="center" mb={4} gap={3}>
              <HStack gap={1}>
                <Icon as={LuStar} color="#fbbf24" />
                <Text fontWeight="700" color="#0f172a">
                  {restaurant.rating.toFixed(1)}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  ({restaurant.reviews}+ reviews)
                </Text>
              </HStack>
              <HStack gap={1} color="gray.500">
                <Icon as={LuMapPin} />
                <Text fontSize="sm">{restaurant.priceRange}</Text>
              </HStack>
            </Flex>

            <Button
              width="100%"
              borderRadius="full"
              bg="linear-gradient(120deg, #0ea5e9, #14b8a6)"
              color="white"
              _hover={{ opacity: 0.9 }}
            >
              Book now
            </Button>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default RestaurantGrid;

