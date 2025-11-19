/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, Button, Input, HStack, VStack, Flex } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuSearch, LuMapPin, LuCalendar, LuClock, LuUsers } from "react-icons/lu";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const heroStyles = css`
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #14b8a6 50%, #10b981 75%, #0ea5e9 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  position: relative;
  overflow: hidden;
  padding: 80px 0;
  min-height: 600px;
  display: flex;
  align-items: center;
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @media (max-width: 768px) {
    padding: 60px 0;
    min-height: 500px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: ${float} 8s ease-in-out infinite;
    pointer-events: none;
  }
`;

const searchCardStyles = css`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: ${fadeInUp} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 16px;
  }
`;

const HeroSection = () => {
  return (
    <Box css={heroStyles}>
      <Container maxW="1200px" px={4} position="relative" zIndex={1}>
        <VStack gap={10} align="center">
          <VStack gap={4} textAlign="center" color="white">
            <Heading
              fontSize={{ base: "2.5rem", md: "3.5rem", lg: "4.5rem" }}
              fontWeight="800"
              letterSpacing="-4px"
              textAlign="center"
              mx="auto"
              maxW="900px"
              width="100%"
              lineHeight="3.426rem"
              css={css`
                animation: ${fadeInUp} 0.6s ease-out;
                text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
              `}
            >
              Book Your Table Instantly at Top Restaurants Near You
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              opacity={0.95}
              maxW="700px"
              textAlign="center"
              mx="auto"
              css={css`
                animation: ${fadeInUp} 0.8s ease-out;
              `}
            >
              Discover amazing dining experiences and reserve your perfect table in seconds
            </Text>
          </VStack>

          <Box css={searchCardStyles} width="100%" maxW="900px">
            <VStack gap={4}>
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={3}
                width="100%"
              >
                <Box flex={1} position="relative">
                  <LuMapPin
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                      zIndex: 1,
                    }}
                    size={20}
                  />
                  <Input
                    placeholder="Location"
                    pl="40px"
                    height="50px"
                    borderRadius="12px"
                    border="2px solid #e0f2fe"
                    _focus={{ borderColor: "#0ea5e9", boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)" }}
                  />
                </Box>
                <Box flex={1} position="relative">
                  <LuCalendar
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                      zIndex: 1,
                    }}
                    size={20}
                  />
                  <Input
                    type="date"
                    pl="40px"
                    height="50px"
                    borderRadius="12px"
                    border="2px solid #e0f2fe"
                    _focus={{ borderColor: "#0ea5e9", boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)" }}
                  />
                </Box>
                <Box flex={1} position="relative">
                  <LuClock
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                      zIndex: 1,
                    }}
                    size={20}
                  />
                  <Input
                    type="time"
                    pl="40px"
                    height="50px"
                    borderRadius="12px"
                    border="2px solid #e0f2fe"
                    _focus={{ borderColor: "#0ea5e9", boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)" }}
                  />
                </Box>
                <Box flex={1} position="relative">
                  <LuUsers
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                      zIndex: 1,
                    }}
                    size={20}
                  />
                  <Input
                    placeholder="Guests"
                    pl="40px"
                    height="50px"
                    borderRadius="12px"
                    border="2px solid #e0f2fe"
                    _focus={{ borderColor: "#0ea5e9", boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)" }}
                  />
                </Box>
              </Flex>
              <HStack gap={3} width="100%">
                <Button
                  flex={1}
                  height="50px"
                  bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
                  color="white"
                  borderRadius="12px"
                  fontWeight="700"
                  fontSize="16px"
                  _hover={{
                    bg: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(14, 165, 233, 0.4)",
                  }}
                  transition="all 0.3s ease"
                >
                  <LuSearch size={20} style={{ marginRight: "8px" }} />
                  Find a Table
                </Button>
                <Button
                  variant="outline"
                  height="50px"
                  borderColor="#0ea5e9"
                  color="#0ea5e9"
                  borderRadius="12px"
                  fontWeight="600"
                  _hover={{
                    bg: "rgba(14, 165, 233, 0.1)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.3s ease"
                >
                  Explore Restaurants
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HeroSection;

