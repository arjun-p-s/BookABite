/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuSearch, LuCheck, LuClock, LuUtensilsCrossed } from "react-icons/lu";

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

const iconFloat = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const stepCardStyles = css`
  padding: 32px 24px;
  background: white;
  border-radius: 16px;
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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  animation: ${iconFloat} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const steps = [
  {
    icon: LuSearch,
    title: "Search for Restaurants",
    description: "Browse through thousands of restaurants in your area",
  },
  {
    icon: LuCheck,
    title: "Choose Your Table",
    description: "Select your preferred date, time, and table",
  },
  {
    icon: LuClock,
    title: "Reserve Instantly",
    description: "Confirm your booking in just a few clicks",
  },
  {
    icon: LuUtensilsCrossed,
    title: "Dine and Enjoy",
    description: "Arrive and enjoy your perfect dining experience",
  },
];

const HowItWorks = () => {
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
              How It Works
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#64748b"
              css={css`
                animation: ${fadeIn} 0.8s ease-out;
              `}
            >
              Book your perfect table in just 4 simple steps
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6} width="100%">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Box
                  key={index}
                  css={[stepCardStyles, css`
                    animation-delay: ${index * 0.1}s;
                  `]}
                >
                  <Box css={iconWrapperStyles}>
                    <Icon size={40} color="white" />
                  </Box>
                  <Heading fontSize="xl" fontWeight="700" mb={3} color="#0f172a">
                    {step.title}
                  </Heading>
                  <Text fontSize="sm" color="#64748b" lineHeight="1.6">
                    {step.description}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default HowItWorks;

