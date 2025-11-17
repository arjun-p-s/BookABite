/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Badge } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuStar } from "react-icons/lu";

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

const reviewCardStyles = css`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York",
    rating: 5,
    comment: "Amazing experience! Found the perfect restaurant for our anniversary dinner. The booking process was seamless.",
    restaurant: "The Gourmet Kitchen",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "San Francisco",
    rating: 5,
    comment: "Love how easy it is to find and book tables. The real-time availability feature is a game-changer!",
    restaurant: "Ocean Breeze",
    date: "5 days ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Los Angeles",
    rating: 5,
    comment: "Great platform! Discovered so many amazing restaurants I never knew existed. Highly recommend!",
    restaurant: "Spice Route",
    date: "1 week ago",
  },
  {
    id: 4,
    name: "David Thompson",
    location: "Chicago",
    rating: 5,
    comment: "The exclusive deals are fantastic. Saved so much money while enjoying top-notch dining experiences.",
    restaurant: "BBQ Masters",
    date: "3 days ago",
  },
];

const ReviewsTestimonials = () => {
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
              What Our Users Say
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#64748b"
              css={css`
                animation: ${fadeIn} 0.8s ease-out;
              `}
            >
              Real reviews from real diners
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="100%">
            {reviews.map((review, index) => (
              <Box
                key={review.id}
                css={[reviewCardStyles, css`
                  animation-delay: ${index * 0.1}s;
                `]}
              >
                <VStack align="flex-start" gap={4}>
                  <HStack justify="space-between" width="100%">
                    <HStack gap={3}>
                      <Box
                        width="40px"
                        height="40px"
                        borderRadius="50%"
                        bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="700"
                        fontSize="sm"
                      >
                        {review.name.charAt(0)}
                      </Box>
                      <VStack align="flex-start" gap={0}>
                        <Text fontWeight="700" color="#0f172a">
                          {review.name}
                        </Text>
                        <Text fontSize="sm" color="#64748b">
                          {review.location}
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack gap={1}>
                      {[...Array(review.rating)].map((_, i) => (
                        <LuStar key={i} size={16} color="#fbbf24" fill="#fbbf24" />
                      ))}
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" color="#64748b" lineHeight="1.6">
                    "{review.comment}"
                  </Text>
                  <HStack justify="space-between" width="100%" pt={2} borderTop="1px solid #e2e8f0">
                    <Badge
                      bg="rgba(14, 165, 233, 0.1)"
                      color="#0ea5e9"
                      px={2}
                      py={1}
                      borderRadius="6px"
                      fontSize="xs"
                    >
                      {review.restaurant}
                    </Badge>
                    <Text fontSize="xs" color="#94a3b8">
                      {review.date}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default ReviewsTestimonials;

