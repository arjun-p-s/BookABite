/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, HStack, Badge, Button } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuClock, LuCheck } from "react-icons/lu";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const availabilityCardStyles = css`
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  border-radius: 20px;
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 32px 24px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 8s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(30px, -30px) rotate(5deg); }
  }
`;

const liveIndicatorStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const restaurants = [
  { name: "The Gourmet Kitchen", time: "7:30 PM", tables: 3 },
  { name: "Ocean Breeze", time: "8:00 PM", tables: 2 },
  { name: "Spice Route", time: "7:00 PM", tables: 5 },
];

const AvailabilityChecker = () => {
  return (
    <Box py={{ base: 16, md: 24 }} bg="white">
      <Container maxW="1200px" px={4}>
        <Box css={availabilityCardStyles} position="relative" zIndex={1}>
          <VStack gap={6} align="flex-start">
            <HStack gap={4} width="100%" justify="space-between" flexWrap="wrap">
              <VStack align="flex-start" gap={2}>
                <HStack gap={2}>
                  <Heading fontSize={{ base: "1.5rem", md: "2rem" }} fontWeight="800">
                    Tables Available Now
                  </Heading>
                  <Box css={liveIndicatorStyles}>
                    <Text fontSize="sm" fontWeight="600">LIVE</Text>
                  </Box>
                </HStack>
                <Text fontSize={{ base: "sm", md: "md" }} opacity={0.9}>
                  Real-time availability for immediate bookings
                </Text>
              </VStack>
            </HStack>

            <VStack gap={3} width="100%" align="stretch">
              {restaurants.map((restaurant, index) => (
                <Box
                  key={index}
                  bg="rgba(255, 255, 255, 0.15)"
                  backdropFilter="blur(10px)"
                  borderRadius="12px"
                  p={4}
                  css={css`
                    animation: ${fadeIn} 0.6s ease-out;
                    animation-delay: ${index * 0.1}s;
                  `}
                >
                  <HStack justify="space-between" flexWrap="wrap" gap={3}>
                    <VStack align="flex-start" gap={1}>
                      <HStack gap={2}>
                        <LuCheck size={20} />
                        <Text fontWeight="700" fontSize={{ base: "sm", md: "md" }}>
                          {restaurant.name}
                        </Text>
                      </HStack>
                      <HStack gap={4} pl={7}>
                        <HStack gap={1}>
                          <LuClock size={16} />
                          <Text fontSize="sm" opacity={0.9}>
                            {restaurant.time}
                          </Text>
                        </HStack>
                        <Badge
                          bg="rgba(255, 255, 255, 0.3)"
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="6px"
                        >
                          {restaurant.tables} tables
                        </Badge>
                      </HStack>
                    </VStack>
                    <Button
                      bg="white"
                      color="#0ea5e9"
                      fontWeight="700"
                      borderRadius="10px"
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.9)",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.3s ease"
                    >
                      Book Now
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default AvailabilityChecker;

