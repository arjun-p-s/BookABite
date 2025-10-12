// Header.tsx
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  HStack,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { LuMenu, LuX, LuUser } from "react-icons/lu";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Box
      as="header"
      bg="white"
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Container maxW="1200px" px={4}>
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          py={4}
        >
          {/* Logo */}
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Heading
              size="lg"
              bgGradient="to-r"
              gradientFrom="brand.500"
              gradientTo="purple.600"
              bgClip="text"
              fontWeight="bold"
            >
              BookABite
            </Heading>
          </Link>

          {/* Desktop Navigation */}
          <HStack
            gap={8}
            display={{ base: "none", md: "flex" }}
          >
            <Link
              href="/"
              fontSize="md"
              fontWeight="medium"
              color="gray.700"
              _hover={{ color: "brand.500" }}
            >
              Home
            </Link>
            <Link
              href="/restaurants"
              fontSize="md"
              fontWeight="medium"
              color="gray.700"
              _hover={{ color: "brand.500" }}
            >
              Restaurants
            </Link>
            <Link
              href="/about"
              fontSize="md"
              fontWeight="medium"
              color="gray.700"
              _hover={{ color: "brand.500" }}
            >
              About
            </Link>
            <Link
              href="/contact"
              fontSize="md"
              fontWeight="medium"
              color="gray.700"
              _hover={{ color: "brand.500" }}
            >
              Contact
            </Link>
          </HStack>

          {/* Desktop Auth Buttons */}
          <HStack gap={3} display={{ base: "none", md: "flex" }}>
            <Button
              variant="ghost"
              colorScheme="purple"
              leftIcon={<LuUser />}
            >
              Login
            </Button>
            <Button
              bgGradient="to-r"
              gradientFrom="brand.500"
              gradientTo="purple.600"
              color="white"
              _hover={{ opacity: 0.9 }}
              borderRadius="10px"
            >
              Sign Up
            </Button>
          </HStack>

          {/* Mobile Menu Toggle */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            icon={isMobileMenuOpen ? <LuX /> : <LuMenu />}
            variant="ghost"
            aria-label="Toggle menu"
          />
        </Flex>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <Box
            pb={4}
            display={{ base: "block", md: "none" }}
          >
            <Flex direction="column" gap={4}>
              <Link
                href="/"
                fontSize="md"
                fontWeight="medium"
                color="gray.700"
                _hover={{ color: "brand.500" }}
              >
                Home
              </Link>
              <Link
                href="/restaurants"
                fontSize="md"
                fontWeight="medium"
                color="gray.700"
                _hover={{ color: "brand.500" }}
              >
                Restaurants
              </Link>
              <Link
                href="/about"
                fontSize="md"
                fontWeight="medium"
                color="gray.700"
                _hover={{ color: "brand.500" }}
              >
                About
              </Link>
              <Link
                href="/contact"
                fontSize="md"
                fontWeight="medium"
                color="gray.700"
                _hover={{ color: "brand.500" }}
              >
                Contact
              </Link>
              <Button
                variant="ghost"
                colorScheme="purple"
                leftIcon={<LuUser />}
                justifyContent="flex-start"
              >
                Login
              </Button>
              <Button
                bgGradient="to-r"
                gradientFrom="brand.500"
                gradientTo="purple.600"
                color="white"
                _hover={{ opacity: 0.9 }}
                borderRadius="10px"
              >
                Sign Up
              </Button>
            </Flex>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Header;