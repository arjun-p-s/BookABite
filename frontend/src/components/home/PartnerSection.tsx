/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, SimpleGrid, Button } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuTrendingUp, LuChartBarBig, LuUsers, LuShield } from "react-icons/lu";

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

const benefitCardStyles = css`
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const iconWrapperStyles = css`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const benefits = [
  {
    icon: LuTrendingUp,
    title: "Increased Exposure",
    description: "Reach thousands of potential customers actively looking for dining options",
  },
  {
    icon: LuChartBarBig,
    title: "Analytics Dashboard",
    description: "Track bookings, revenue, and customer insights in real-time",
  },
  {
    icon: LuUsers,
    title: "Table Management",
    description: "Efficient tools to manage reservations and optimize seating",
  },
  {
    icon: LuShield,
    title: "Secure Platform",
    description: "Safe and reliable booking system with customer protection",
  },
];

const PartnerSection = () => {
  return (
    <Box py={{ base: 16, md: 24 }} bg="white">
      <Container maxW="1200px" px={4}>
        <VStack gap={12}>
          <VStack gap={4} textAlign="center" maxW="700px" mx="auto">
            <Heading
              fontSize={{ base: "2rem", md: "2.5rem" }}
              fontWeight="800"
              color="#0f172a"
              css={css`
                animation: ${fadeIn} 0.6s ease-out;
              `}
            >
              Partner With Us
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#64748b"
              css={css`
                animation: ${fadeIn} 0.8s ease-out;
              `}
            >
              Grow your restaurant business with BookABite. Join thousands of successful restaurant partners.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6} width="100%">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Box
                  key={index}
                  css={[benefitCardStyles, css`
                    animation-delay: ${index * 0.1}s;
                  `]}
                >
                  <Box css={iconWrapperStyles}>
                    <Icon size={32} color="white" />
                  </Box>
                  <Heading fontSize="lg" fontWeight="700" mb={2} color="#0f172a">
                    {benefit.title}
                  </Heading>
                  <Text fontSize="sm" color="#64748b" lineHeight="1.6">
                    {benefit.description}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          <VStack gap={6} width="100%">
            <Button
              size="lg"
              bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
              color="white"
              fontWeight="700"
              borderRadius="12px"
              px={8}
              py={6}
              fontSize="lg"
              _hover={{
                bg: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(14, 165, 233, 0.4)",
              }}
              transition="all 0.3s ease"
            >
              List Your Restaurant
            </Button>
            <Text fontSize="sm" color="#64748b">
              Free to join • No setup fees • Start accepting bookings today
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default PartnerSection;

