/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Button, Badge } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuGift, LuZap, LuCrown, LuStar } from "react-icons/lu";

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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const loyaltyCardStyles = css`
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  border-radius: 20px;
  padding: 48px 40px;
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
    animation: ${float} 8s ease-in-out infinite;
    pointer-events: none;
  }
`;

const benefitCardStyles = css`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-4px);
  }
`;

const benefits = [
  {
    icon: LuGift,
    title: "Reward Points",
    description: "Earn points with every booking",
  },
  {
    icon: LuZap,
    title: "Faster Check-in",
    description: "Priority seating and quick service",
  },
  {
    icon: LuCrown,
    title: "Exclusive Deals",
    description: "Member-only discounts and offers",
  },
  {
    icon: LuStar,
    title: "VIP Treatment",
    description: "Special perks at partner restaurants",
  },
];

const LoyaltySection = () => {
  return (
    <Box py={{ base: 16, md: 24 }} bg="white">
      <Container maxW="1200px" px={4}>
        <Box css={loyaltyCardStyles} position="relative" zIndex={1}>
          <VStack gap={8}>
            <VStack gap={4} textAlign="center" maxW="700px" mx="auto">
              <Badge
                bg="rgba(255, 255, 255, 0.2)"
                color="white"
                px={4}
                py={2}
                borderRadius="20px"
                fontSize="sm"
                fontWeight="700"
              >
                BookABite Loyalty Program
              </Badge>
              <Heading
                fontSize={{ base: "2rem", md: "2.5rem" }}
                fontWeight="800"
                css={css`
                  animation: ${fadeIn} 0.6s ease-out;
                `}
              >
                Unlock Exclusive Benefits
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                opacity={0.95}
                css={css`
                  animation: ${fadeIn} 0.8s ease-out;
                `}
              >
                Join thousands of members enjoying exclusive perks, rewards, and faster bookings
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} width="100%">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Box
                    key={index}
                    css={[benefitCardStyles, css`
                      animation: ${fadeIn} 0.6s ease-out;
                      animation-delay: ${index * 0.1}s;
                    `]}
                  >
                    <HStack gap={4}>
                      <Box
                        bg="rgba(255, 255, 255, 0.2)"
                        borderRadius="12px"
                        p={3}
                      >
                        <Icon size={24} />
                      </Box>
                      <VStack align="flex-start" gap={1}>
                        <Heading fontSize="md" fontWeight="700">
                          {benefit.title}
                        </Heading>
                        <Text fontSize="sm" opacity={0.9}>
                          {benefit.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                );
              })}
            </SimpleGrid>

            <Button
              bg="white"
              color="#0ea5e9"
              size="lg"
              fontWeight="700"
              borderRadius="12px"
              px={8}
              _hover={{
                bg: "rgba(255, 255, 255, 0.9)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              }}
              transition="all 0.3s ease"
            >
              Join Now - It's Free!
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default LoyaltySection;

