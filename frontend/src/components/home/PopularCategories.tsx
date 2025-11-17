/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const categoryCardStyles = css`
  padding: 32px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.2);
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%);
  }
  
  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const categories = [
  { id: 1, name: "Family-Friendly", icon: "👨‍👩‍👧‍👦", count: 156 },
  { id: 2, name: "Rooftop", icon: "🏙️", count: 89 },
  { id: 3, name: "Luxury Dining", icon: "✨", count: 67 },
  { id: 4, name: "Budget Eats", icon: "💰", count: 234 },
  { id: 5, name: "Vegetarian", icon: "🥗", count: 178 },
  { id: 6, name: "Non-Vegetarian", icon: "🍖", count: 312 },
  { id: 7, name: "Fast Food", icon: "🍔", count: 145 },
  { id: 8, name: "Near Me", icon: "📍", count: 98 },
];

const PopularCategories = () => {
  return (
    <Box py={{ base: 16, md: 24 }} bg="#f8fafc">
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
              Popular Categories
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#64748b"
              css={css`
                animation: ${fadeIn} 0.8s ease-out;
              `}
            >
              Explore restaurants by your preferences
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={4} width="100%">
            {categories.map((category, index) => (
              <Box
                key={category.id}
                css={[categoryCardStyles, css`
                  animation-delay: ${index * 0.05}s;
                `]}
              >
                <Text fontSize="3rem" mb={2}>{category.icon}</Text>
                <Heading fontSize="md" fontWeight="700" mb={1} color="#0f172a">
                  {category.name}
                </Heading>
                <Text fontSize="sm" color="#64748b">
                  {category.count} restaurants
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default PopularCategories;

