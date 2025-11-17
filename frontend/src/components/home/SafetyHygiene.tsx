/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, SimpleGrid, HStack } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuShield, LuCheck, LuBadgeCheck, LuHeart } from "react-icons/lu";

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

const safetyCardStyles = css`
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.2);
    border-color: #0ea5e9;
  }
  
  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const iconWrapperStyles = css`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const safetyFeatures = [
  {
    icon: LuShield,
    title: "Hygienic Restaurants",
    description: "All partner restaurants follow strict hygiene protocols",
    color: "#0ea5e9",
  },
  {
    icon: LuBadgeCheck,
    title: "Verified Kitchens",
    description: "Regular inspections ensure food safety standards",
    color: "#14b8a6",
  },
  {
    icon: LuCheck,
    title: "Safe Dining Guarantee",
    description: "Your health and safety is our top priority",
    color: "#10b981",
  },
  {
    icon: LuHeart,
    title: "Customer Protection",
    description: "Secure payments and cancellation policies",
    color: "#0ea5e9",
  },
];

const SafetyHygiene = () => {
  return (
    <Box py={{ base: 16, md: 24 }} bg="#f8fafc">
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
              Safety, Hygiene & Guarantee
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#64748b"
              css={css`
                animation: ${fadeIn} 0.8s ease-out;
              `}
            >
              Your health and safety is our commitment. We ensure all restaurants meet the highest standards.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6} width="100%">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Box
                  key={index}
                  css={[safetyCardStyles, css`
                    animation-delay: ${index * 0.1}s;
                  `]}
                >
                  <Box css={iconWrapperStyles}>
                    <Icon size={40} color={feature.color} />
                  </Box>
                  <Heading fontSize="lg" fontWeight="700" mb={2} color="#0f172a">
                    {feature.title}
                  </Heading>
                  <Text fontSize="sm" color="#64748b" lineHeight="1.6">
                    {feature.description}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          <Box
            bg="linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)"
            borderRadius="16px"
            p={6}
            width="100%"
            maxW="800px"
            textAlign="center"
          >
            <HStack justify="center" gap={2} mb={3}>
              <LuShield size={24} color="#0ea5e9" />
              <Text fontWeight="700" color="#0f172a" fontSize="lg">
                BookABite Safety Promise
              </Text>
            </HStack>
            <Text fontSize="sm" color="#64748b" lineHeight="1.6">
              We work closely with all our restaurant partners to ensure they maintain the highest standards
              of hygiene and safety. Every restaurant is verified and regularly inspected to guarantee your
              peace of mind.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default SafetyHygiene;

