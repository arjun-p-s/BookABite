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
  Spinner,
  Center,
  Image,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LuMapPin, LuStar } from "react-icons/lu";

type Restaurant = {
  _id: string;
  name: string;
  description: string;
  mainImage: string;
  cuisineType: string[];
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  rating?: number;
  reviews?: number;
  priceRange?: string;
};

const hoverRise = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-6px); }
`;

const RestaurantGrid = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3002/restaurants/list");
        
        console.log("API Response:", response.data); // Debug log
        
        // Handle different response structures
        let restaurantData: Restaurant[] = [];
        
        if (Array.isArray(response.data)) {
          restaurantData = response.data;
        } else if (response.data.restaurants && Array.isArray(response.data.restaurants)) {
          restaurantData = response.data.restaurants;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          restaurantData = response.data.data;
        } else {
          console.error("Unexpected API response structure:", response.data);
          setError("Invalid data format received from server");
          setIsLoading(false);
          return;
        }
        
        // Debug: Log first restaurant's mainImage
        if (restaurantData.length > 0) {
          console.log("First restaurant mainImage:", restaurantData[0].mainImage);
        }
        
        setRestaurants(restaurantData);
        setError(null);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <Center minH="400px">
        <Box textAlign="center">
          <Spinner size="xl" color="#0ea5e9" thickness="4px" mb={4} />
          <Text color="gray.600">Loading restaurants...</Text>
        </Box>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="400px">
        <Box textAlign="center">
          <Text color="red.500" fontSize="lg" mb={4}>
            {error}
          </Text>
          <Button
            colorScheme="cyan"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      </Center>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <Center minH="400px">
        <Box textAlign="center">
          <Text color="gray.600" fontSize="lg">
            No restaurants found. Be the first to register!
          </Text>
        </Box>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 5, md: 6 }}>
      {restaurants.map((restaurant) => (
        <Box
          key={restaurant._id}
          borderRadius="28px"
          overflow="hidden"
          border="1px solid rgba(15,23,42,0.08)"
          bg="white"
          boxShadow="0 16px 40px rgba(15,23,42,0.12)"
          display="flex"
          flexDirection="column"
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          _hover={{ 
            transform: "translateY(-6px)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.18)"
          }}
        >
          {/* ⭐ Changed from background-image to Image component */}
          <Box
            h={{ base: "200px", md: "220px" }}
            position="relative"
            bg="gray.200"
            overflow="hidden"
          >
            <Image
              src={restaurant.mainImage}
              alt={restaurant.name}
              width="100%"
              height="100%"
              objectFit="cover"
              fallback={
                <Box 
                  width="100%" 
                  height="100%" 
                  bg="gray.200" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Text color="gray.500">No Image</Text>
                </Box>
              }
              onError={(e) => {
                console.error("Image failed to load:", restaurant.mainImage);
              }}
            />
          </Box>

          <Box p={{ base: 5, md: 6 }} display="flex" flexDirection="column" flex="1">
            <HStack justify="space-between" align="flex-start" mb={3} gap={3}>
              <Heading fontSize={{ base: "xl", md: "1.35rem" }} color="#0f172a" noOfLines={1}>
                {restaurant.name}
              </Heading>
              {restaurant.cuisineType && restaurant.cuisineType.length > 0 && (
                <Badge colorScheme="cyan" borderRadius="full" flexShrink={0}>
                  {restaurant.cuisineType[0]}
                </Badge>
              )}
            </HStack>

            <Text color="gray.600" fontSize="sm" mb={3} flex="1" noOfLines={2}>
              {restaurant.description || "Delicious food and great ambiance"}
            </Text>

            <Flex justify="space-between" align="center" mb={4} gap={3}>
              <HStack gap={1}>
                <Icon as={LuStar} color="#fbbf24" />
                <Text fontWeight="700" color="#0f172a">
                  {restaurant.rating?.toFixed(1) || "4.5"}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  ({restaurant.reviews || 0}+ reviews)
                </Text>
              </HStack>
              <HStack gap={1} color="gray.500" flexShrink={0}>
                <Icon as={LuMapPin} />
                <Text fontSize="sm" noOfLines={1}>
                  {restaurant.address?.city || restaurant.priceRange || "$$"}
                </Text>
              </HStack>
            </Flex>

            <Button
              width="100%"
              borderRadius="full"
              bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
              color="white"
              _hover={{ 
                bgGradient: "linear(to-r, #14b8a6, #10b981)",
                transform: "translateY(-2px)"
              }}
              onClick={() => {
                navigate(`/booking?id=${restaurant._id}`);
              }}
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