/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";

const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const heroStyles = css`
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #14b8a6 50%, #10b981 75%, #0ea5e9 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 20s ease infinite;
  position: relative;
  overflow: hidden;
  padding: 60px 0;
  
  @media (max-width: 768px) {
    padding: 40px 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const RegistrationHero = () => {
  return (
    <Box css={heroStyles} position="relative" zIndex={1}>
      <Container maxW="1200px" px={{ base: 4, md: 6 }}>
        <VStack gap={4} align="center" textAlign="center" color="white">
          <Heading
            fontSize={{ base: "2rem", md: "3rem" }}
            fontWeight="800"
            letterSpacing="-1px"
            css={css`
              animation: ${floatUp} 0.6s ease-out;
              text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
            `}
          >
            Register Your Restaurant
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            opacity={0.95}
            maxW="600px"
            css={css`
              animation: ${floatUp} 0.8s ease-out;
            `}
          >
            Join BookABite and showcase your culinary excellence to thousands of food lovers
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default RegistrationHero;

