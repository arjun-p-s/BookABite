import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ListingHero = () => {
  return (
    <Box
      borderRadius="32px"
      bgGradient="linear(120deg, #0ea5e9, #14b8a6, #0ea5e9)"
      bgSize="200% 200%"
      animation={`${gradientShift} 18s ease infinite`}
      color="white"
      p={{ base: 8, md: 12 }}
      textAlign={{ base: "center", md: "left" }}
      boxShadow="0 25px 60px rgba(15,23,42,0.25)"
    >
      <Stack gap={4} align={{ base: "center", md: "flex-start" }}>
        <Heading fontSize={{ base: "2.25rem", md: "3rem" }} lineHeight="1.1">
          Discover Restaurants Crafted For Your Moments
        </Heading>
        <Text maxW="720px" fontSize={{ base: "md", md: "lg" }} opacity={0.9}>
          Browse handpicked venues known for thoughtful service, immersive atmospheres, and culinary storytelling.
          Filter by cuisine, vibe, or price—then reserve effortlessly.
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} gap={3}>
          <Button
            bg="white"
            color="#0ea5e9"
            borderRadius="full"
            px={8}
            py={6}
            fontWeight="600"
            _hover={{ opacity: 0.9 }}
          >
            Explore curated picks
          </Button>
          <Button
            variant="outline"
            borderColor="rgba(255,255,255,0.7)"
            color="white"
            borderRadius="full"
            px={8}
            py={6}
            _hover={{ bg: "rgba(255,255,255,0.15)" }}
          >
            Learn about partnerships
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ListingHero;

