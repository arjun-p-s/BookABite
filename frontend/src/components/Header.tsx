/** @jsxImportSource @emotion/react */
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  HStack,
  IconButton,
  Link,
  Text,
} from "@chakra-ui/react";
import { LuMenu, LuX, LuUser } from "react-icons/lu";
import { useState } from "react";
import { css, keyframes } from "@emotion/react";
import type { ComponentProps } from "react";

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const headerStyles = css`
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1),
              0 2px 8px rgba(14, 165, 233, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
  animation: ${slideDown} 0.4s ease-out;
  
  @media (max-width: 768px) {
    box-shadow: 0 2px 12px rgba(14, 165, 233, 0.1);
  }
`;

const linkStyles = css`
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #0ea5e9 0%, #14b8a6 100%);
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const buttonStyles = css`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
`;

const StyledHeader = (props: ComponentProps<typeof Box>) => (
  <Box css={headerStyles} as="header" {...props} />
);

const StyledLink = (props: ComponentProps<typeof Link>) => (
  <Link css={linkStyles} {...props} />
);

const StyledButton = (props: ComponentProps<typeof Button>) => (
  <Button css={buttonStyles} {...props} />
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <StyledHeader>
      <Container maxW="1200px" px={{ base: 3, md: 4 }}>
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          py={{ base: 3, md: 4 }}
        >
          {/* Logo */}
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Heading
              size="lg"
              css={css`
                background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 50%, #10b981 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 800;
                font-size: 1.75rem;
                letter-spacing: -0.5px;
                transition: all 0.3s ease;
                
                @media (max-width: 480px) {
                  font-size: 1.5rem;
                }
                
                &:hover {
                  transform: scale(1.05);
                }
              `}
            >
              BookABite
            </Heading>
          </Link>

          {/* Desktop Navigation */}
          <HStack
            gap={{ base: 4, md: 8 }}
            display={{ base: "none", md: "flex" }}
          >
            <StyledLink
              href="/"
              fontSize="md"
              fontWeight="600"
              color="gray.700"
              _hover={{ color: "#0ea5e9" }}
            >
              Home
            </StyledLink>
            <StyledLink
              href="/restaurants"
              fontSize="md"
              fontWeight="600"
              color="gray.700"
              _hover={{ color: "#0ea5e9" }}
            >
              Restaurants
            </StyledLink>
            <StyledLink
              href="/about"
              fontSize="md"
              fontWeight="600"
              color="gray.700"
              _hover={{ color: "#0ea5e9" }}
            >
              About
            </StyledLink>
            <StyledLink
              href="/contact"
              fontSize="md"
              fontWeight="600"
              color="gray.700"
              _hover={{ color: "#0ea5e9" }}
            >
              Contact
            </StyledLink>
          </HStack>

          {/* Desktop Auth Buttons */}
          <HStack gap={3} display={{ base: "none", md: "flex" }}>
            <StyledButton
              variant="ghost"
              color="#0ea5e9"
              _hover={{ 
                bg: "rgba(14, 165, 233, 0.1)",
                color: "#14b8a6"
              }}
            >
              <HStack gap={2}>
                <LuUser size={18} />
                <Text>Login</Text>
              </HStack>
            </StyledButton>
            <StyledButton
              bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
              color="white"
              _hover={{ 
                bg: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
                opacity: 1
              }}
              borderRadius="10px"
              fontWeight="600"
            >
              Sign Up
            </StyledButton>
          </HStack>

          {/* Mobile Menu Toggle */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="ghost"
            aria-label="Toggle menu"
            color="#0ea5e9"
            _hover={{ 
              bg: "rgba(14, 165, 233, 0.1)",
              transform: "rotate(90deg)"
            }}
            transition="all 0.3s ease"
          >
            {isMobileMenuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </IconButton>
        </Flex>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <Box
            pb={4}
            display={{ base: "block", md: "none" }}
            css={css`
              animation: ${fadeIn} 0.3s ease-out;
            `}
          >
            <Flex direction="column" gap={3}>
              <StyledLink
                href="/"
                fontSize="md"
                fontWeight="600"
                color="gray.700"
                _hover={{ color: "#0ea5e9" }}
                py={2}
              >
                Home
              </StyledLink>
              <StyledLink
                href="/restaurants"
                fontSize="md"
                fontWeight="600"
                color="gray.700"
                _hover={{ color: "#0ea5e9" }}
                py={2}
              >
                Restaurants
              </StyledLink>
              <StyledLink
                href="/about"
                fontSize="md"
                fontWeight="600"
                color="gray.700"
                _hover={{ color: "#0ea5e9" }}
                py={2}
              >
                About
              </StyledLink>
              <StyledLink
                href="/contact"
                fontSize="md"
                fontWeight="600"
                color="gray.700"
                _hover={{ color: "#0ea5e9" }}
                py={2}
              >
                Contact
              </StyledLink>
              <StyledButton
                variant="ghost"
                color="#0ea5e9"
                justifyContent="flex-start"
                _hover={{ 
                  bg: "rgba(14, 165, 233, 0.1)",
                  color: "#14b8a6"
                }}
                mt={2}
              >
                <HStack gap={2}>
                  <LuUser size={18} />
                  <Text>Login</Text>
                </HStack>
              </StyledButton>
              <StyledButton
                bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
                color="white"
                _hover={{ 
                  bg: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
                  opacity: 1
                }}
                borderRadius="10px"
                fontWeight="600"
                mt={1}
              >
                Sign Up
              </StyledButton>
            </Flex>
          </Box>
        )}
      </Container>
    </StyledHeader>
  );
};

export default Header;