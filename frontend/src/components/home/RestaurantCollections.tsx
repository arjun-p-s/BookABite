/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Button } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuArrowRight } from "react-icons/lu";

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

const collectionCardStyles = css`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.2);
    
    &::before {
      transform: scaleY(1);
    }
  }
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const collections = [
  {
    id: 1,
    title: "Top Rated in Your City",
    description: "Discover the highest-rated restaurants loved by locals",
    count: 24,
    icon: "⭐",
  },
  {
    id: 2,
    title: "Great for Date Nights",
    description: "Romantic settings perfect for special occasions",
    count: 18,
    icon: "💕",
  },
  {
    id: 3,
    title: "Group Dining",
    description: "Spacious venues ideal for large gatherings",
    count: 32,
    icon: "👥",
  },
  {
    id: 4,
    title: "Best Brunch Spots",
    description: "Start your day right with amazing brunch options",
    count: 15,
    icon: "🥐",
  },
  {
    id: 5,
    title: "Trending This Week",
    description: "The most popular restaurants right now",
    count: 28,
    icon: "🔥",
  },
  {
    id: 6,
    title: "Budget-Friendly",
    description: "Great food that won't break the bank",
    count: 45,
    icon: "💰",
  },
];

const RestaurantCollections = () => {
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
              Restaurant Collections
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#64748b"
              css={css`
                animation: ${fadeIn} 0.8s ease-out;
              `}
            >
              Curated lists to help you find exactly what you're looking for
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} width="100%">
            {collections.map((collection, index) => (
              <Box
                key={collection.id}
                css={[collectionCardStyles, css`
                  animation-delay: ${index * 0.1}s;
                `]}
              >
                <VStack align="flex-start" gap={4}>
                  <HStack gap={3} width="100%">
                    <Text fontSize="3rem">{collection.icon}</Text>
                    <VStack align="flex-start" gap={1} flex={1}>
                      <Heading fontSize="lg" fontWeight="700" color="#0f172a">
                        {collection.title}
                      </Heading>
                      <Text fontSize="xs" color="#64748b">
                        {collection.count} restaurants
                      </Text>
                    </VStack>
                  </HStack>
                  <Text fontSize="sm" color="#64748b" lineHeight="1.6">
                    {collection.description}
                  </Text>
                  <Button
                    variant="ghost"
                    color="#0ea5e9"
                    fontWeight="600"
                    _hover={{
                      color: "#14b8a6",
                      transform: "translateX(4px)",
                    }}
                    transition="all 0.3s ease"
                    p={0}
                    height="auto"
                  >
                    <HStack gap={1}>
                      <Text>Explore Collection</Text>
                      <LuArrowRight size={16} />
                    </HStack>
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default RestaurantCollections;

