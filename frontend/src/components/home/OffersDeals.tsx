/** @jsxImportSource @emotion/react */
import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Badge, Button } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuTag, LuClock } from "react-icons/lu";

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

const offerCardStyles = css`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.2);
  }
`;

const offerHeaderStyles = css`
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  padding: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(20px, -20px); }
  }
`;

const offers = [
  {
    id: 1,
    title: "Happy Hour Special",
    restaurant: "The Gourmet Kitchen",
    discount: "30% OFF",
    description: "Enjoy 30% off on all drinks and appetizers",
    time: "4:00 PM - 7:00 PM",
    type: "Happy Hour",
  },
  {
    id: 2,
    title: "Festive Feast",
    restaurant: "Spice Route",
    discount: "25% OFF",
    description: "Special festive discount on all main courses",
    time: "Valid until Dec 31",
    type: "Festive",
  },
  {
    id: 3,
    title: "Online Booking Bonus",
    restaurant: "Ocean Breeze",
    discount: "20% OFF",
    description: "Get 20% off when you book online",
    time: "All day",
    type: "Online",
  },
  {
    id: 4,
    title: "Loyalty Rewards",
    restaurant: "BBQ Masters",
    discount: "Free Dessert",
    description: "Earn points and get free dessert on every 5th visit",
    time: "Ongoing",
    type: "Loyalty",
  },
];

const OffersDeals = () => {
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
              Exclusive Offers & Deals
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#64748b"
              css={css`
                animation: ${fadeIn} 0.8s ease-out;
              `}
            >
              Don't miss out on amazing dining deals
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="100%">
            {offers.map((offer, index) => (
              <Box
                key={offer.id}
                css={[offerCardStyles, css`
                  animation-delay: ${index * 0.1}s;
                `]}
              >
                <Box css={offerHeaderStyles} position="relative" zIndex={1}>
                  <VStack align="flex-start" gap={2}>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge
                        bg="rgba(255, 255, 255, 0.3)"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="8px"
                        fontSize="xs"
                        fontWeight="700"
                      >
                        <LuTag size={12} style={{ marginRight: "4px" }} />
                        {offer.type}
                      </Badge>
                      <Text fontSize="2xl" fontWeight="800">
                        {offer.discount}
                      </Text>
                    </HStack>
                    <Heading fontSize="xl" fontWeight="700">
                      {offer.title}
                    </Heading>
                    <Text fontSize="sm" opacity={0.9}>
                      {offer.restaurant}
                    </Text>
                  </VStack>
                </Box>
                <Box p={5}>
                  <VStack align="flex-start" gap={3}>
                    <Text fontSize="sm" color="#64748b" lineHeight="1.6">
                      {offer.description}
                    </Text>
                    <HStack gap={2} color="#64748b" fontSize="sm">
                      <LuClock size={16} />
                      <Text>{offer.time}</Text>
                    </HStack>
                    <Button
                      width="100%"
                      bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
                      color="white"
                      borderRadius="10px"
                      fontWeight="700"
                      _hover={{
                        bg: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(14, 165, 233, 0.3)",
                      }}
                      transition="all 0.3s ease"
                    >
                      Claim Offer
                    </Button>
                  </VStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default OffersDeals;

