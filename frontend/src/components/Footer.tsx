// Footer.tsx

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Link,
  HStack,
  VStack,
  SimpleGrid,
 
  IconButton,
} from "@chakra-ui/react";
import {
  LuFacebook,
  LuTwitter,
  LuInstagram,
  LuMail,
  LuPhone,
  LuMapPin,
  
} from "react-icons/lu";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="white"
      borderTop="1px"
      borderColor="gray.200"
      mt="auto"
    >
      <Container maxW="1200px" px={4} py={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} mb={8}>
          {/* About Section */}
          <VStack align="flex-start" gap={4}>
            <Heading
              size="md"
              bgGradient="to-r"
              gradientFrom="brand.500"
              gradientTo="purple.600"
              bgClip="text"
              fontWeight="bold"
            >
              BookABite
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Your premier destination for restaurant reservations. Discover and
              book the best dining experiences in your city.
            </Text>
            <HStack gap={2}>
              <IconButton
                aria-label="Facebook"
                icon={<LuFacebook />}
                variant="ghost"
                colorScheme="purple"
                size="sm"
              />
              <IconButton
                aria-label="Twitter"
                icon={<LuTwitter />}
                variant="ghost"
                colorScheme="purple"
                size="sm"
              />
              <IconButton
                aria-label="Instagram"
                icon={<LuInstagram />}
                variant="ghost"
                colorScheme="purple"
                size="sm"
              />
            </HStack>
          </VStack>

          {/* Quick Links */}
          <VStack align="flex-start" gap={3}>
            <Heading size="sm" mb={2} color="gray.700">
              Quick Links
            </Heading>
            <Link
              href="/about"
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              About Us
            </Link>
            <Link
              href="/restaurants"
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              Browse Restaurants
            </Link>
            <Link
              href="/how-it-works"
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              How It Works
            </Link>
            <Link
              href="/faq"
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              FAQ
            </Link>
          </VStack>

          {/* Support */}
          <VStack align="flex-start" gap={3}>
            <Heading size="sm" mb={2} color="gray.700">
              Support
            </Heading>
            <Link
              href="/contact"
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              Terms of Service
            </Link>
            <Link
              href="/partners"
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              For Restaurants
            </Link>
          </VStack>

          {/* Contact Info */}
          <VStack align="flex-start" gap={3}>
            <Heading size="sm" mb={2} color="gray.700">
              Contact Info
            </Heading>
            <HStack gap={2} align="flex-start">
              <LuMapPin size={16} color="gray" />
              <Text fontSize="sm" color="gray.600">
                123 Foodie Street, Culinary District, CA 90210
              </Text>
            </HStack>
            <HStack gap={2}>
              <LuPhone size={16} color="gray" />
              <Text fontSize="sm" color="gray.600">
                +1 (555) 123-4567
              </Text>
            </HStack>
            <HStack gap={2}>
              <LuMail size={16} color="gray" />
              <Link
                href="mailto:info@bookabite.com"
                fontSize="sm"
                color="gray.600"
                _hover={{ color: "brand.500" }}
              >
                info@bookabite.com
              </Link>
            </HStack>
          </VStack>
        </SimpleGrid>

       

        {/* Bottom Bar */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="sm" color="gray.600">
            © {currentYear} BookABite. All rights reserved.
          </Text>
          <HStack gap={6} fontSize="sm">
            <Link
              href="/cookies"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              Cookie Policy
            </Link>
            <Link
              href="/accessibility"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              Accessibility
            </Link>
            <Link
              href="/sitemap"
              color="gray.600"
              _hover={{ color: "brand.500" }}
            >
              Sitemap
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
