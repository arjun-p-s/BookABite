/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, SimpleGrid, Button, HStack, Badge } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuStar, LuMapPin } from "react-icons/lu";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const restaurantCardStyles = css`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.2);
  }
`;

const imageStyles = css`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 800;
  
  @media (max-width: 768px) {
    height: 160px;
    font-size: 2rem;
  }
`;

// Demo data
const restaurants = [
  {
    id: 1,
    name: "The Gourmet Kitchen",
    cuisine: "Italian",
    rating: 4.8,
    reviews: 234,
    location: "Downtown",
    image: "🍝",
  },
  {
    id: 2,
    name: "Ocean Breeze",
    cuisine: "Seafood",
    rating: 4.9,
    reviews: 189,
    location: "Waterfront",
    image: "🦞",
  },
  {
    id: 3,
    name: "Spice Route",
    cuisine: "Indian",
    rating: 4.7,
    reviews: 312,
    location: "City Center",
    image: "🍛",
  },
  {
    id: 4,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.9,
    reviews: 267,
    location: "East Side",
    image: "🍣",
  },
  {
    id: 5,
    name: "BBQ Masters",
    cuisine: "American",
    rating: 4.6,
    reviews: 445,
    location: "North District",
    image: "🍖",
  },
  {
    id: 6,
    name: "Le Bistro",
    cuisine: "French",
    rating: 4.8,
    reviews: 198,
    location: "Old Town",
    image: "🥖",
  },
];

const FeaturedRestaurants = () => {
  return (
    <Box py={{ base: 16, md: 24 }} bg="white">
      <Container maxW="1200px" px={4}>
        <VStack gap={12}>
          <VStack gap={4} textAlign="center" maxW="600px" mx="auto">
            <Heading
              fontSize={{ base: "2rem", md: "2.5rem" }}
              fontWeight="800"
              color="#0f172a"
              css={css`
                animation: ${fadeIn} 0.6s ease-out;
              `}
            >
              Featured Restaurants
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#64748b"
              css={css`
                animation: ${fadeIn} 0.8s ease-out;
              `}
            >
              Discover top-rated dining experiences in your city
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6} width="100%">
            {restaurants.map((restaurant, index) => (
              <Box
                key={restaurant.id}
                css={[restaurantCardStyles, css`
                  animation-delay: ${index * 0.1}s;
                `]}
              >
                <Box css={imageStyles}>{restaurant.image}</Box>
                <Box p={5}>
                  <VStack align="flex-start" gap={3}>
                    <VStack align="flex-start" gap={1} width="100%">
                      <Heading fontSize="xl" fontWeight="700" color="#0f172a">
                        {restaurant.name}
                      </Heading>
                      <HStack gap={2}>
                        <Badge
                          bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="6px"
                        >
                          {restaurant.cuisine}
                        </Badge>
                        <HStack gap={1}>
                          <LuStar size={16} color="#fbbf24" fill="#fbbf24" />
                          <Text fontSize="sm" fontWeight="600" color="#0f172a">
                            {restaurant.rating}
                          </Text>
                          <Text fontSize="sm" color="#64748b">
                            ({restaurant.reviews})
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack gap={1} color="#64748b" fontSize="sm">
                        <LuMapPin size={16} />
                        <Text>{restaurant.location}</Text>
                      </HStack>
                    </VStack>
                    <Button
                      width="100%"
                      bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
                      color="white"
                      borderRadius="10px"
                      fontWeight="700"
                      _hover={{
                        bg: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(14, 165, 233, 0.3)",
                      }}
                      transition="all 0.3s ease"
                    >
                      Reserve Now
                    </Button>
                  </VStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default FeaturedRestaurants;

