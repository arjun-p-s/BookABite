/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, HStack, Button, Flex, Text as ChakraText } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuSmartphone, LuApple, LuPlay } from "react-icons/lu";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
`;

const promoStyles = css`
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #14b8a6 50%, #10b981 75%, #0ea5e9 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  border-radius: 24px;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @media (max-width: 768px) {
    padding: 40px 24px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: ${float} 10s ease-in-out infinite;
    pointer-events: none;
  }
`;

const phoneMockupStyles = css`
  width: 200px;
  height: 400px;
  background: #1a1a1a;
  border-radius: 40px;
  padding: 20px 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: ${float} 4s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 300px;
    border-radius: 30px;
    padding: 15px 8px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #333;
    border-radius: 2px;
  }
`;

const screenStyles = css`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 800;
  
  @media (max-width: 768px) {
    border-radius: 22px;
    font-size: 1.5rem;
  }
`;

const MobileAppPromo = () => {
  return (
    <Box py={{ base: 16, md: 24 }} bg="#f8fafc">
      <Container maxW="1200px" px={4}>
        <Box css={promoStyles} position="relative" zIndex={1}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            justify="space-between"
            gap={8}
          >
            <VStack align={{ base: "center", lg: "flex-start" }} gap={6} flex={1} textAlign={{ base: "center", lg: "left" }}>
              <VStack align={{ base: "center", lg: "flex-start" }} gap={4}>
                <Heading
                  fontSize={{ base: "2rem", md: "2.5rem" }}
                  fontWeight="800"
                  color="white"
                  css={css`
                    animation: ${fadeIn} 0.6s ease-out;
                  `}
                >
                  Download Our Mobile App
                </Heading>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="white"
                  opacity={0.95}
                  maxW="500px"
                  css={css`
                    animation: ${fadeIn} 0.8s ease-out;
                  `}
                >
                  Book tables on the go, get exclusive mobile-only deals, and manage your reservations anytime, anywhere.
                </Text>
              </VStack>
              <HStack gap={4} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
                <Button
                  bg="white"
                  color="#0ea5e9"
                  size="lg"
                  fontWeight="700"
                  borderRadius="12px"
                  px={6}
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  }}
                  transition="all 0.3s ease"
                >
                  <HStack gap={2}>
                    <LuApple size={24} />
                    <ChakraText>App Store</ChakraText>
                  </HStack>
                </Button>
                <Button
                  bg="white"
                  color="#0ea5e9"
                  size="lg"
                  fontWeight="700"
                  borderRadius="12px"
                  px={6}
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  }}
                  transition="all 0.3s ease"
                >
                  <HStack gap={2}>
                    <LuPlay size={24} />
                    <ChakraText>Google Play</ChakraText>
                  </HStack>
                </Button>
              </HStack>
            </VStack>
            <Box css={phoneMockupStyles} position="relative" zIndex={1}>
              <Box css={screenStyles}>
                <LuSmartphone size={80} />
              </Box>
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default MobileAppPromo;

