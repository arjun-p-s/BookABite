import { Box, Input, Button, Heading, Text, Link } from "@chakra-ui/react";
import type {ComponentProps}  from "react";

export const LoginContainer = (props: ComponentProps<typeof Box>) => (
  <Box
    minH="100vh"
    minW="100vw"
    bg="background.primary"
    display="flex"
    alignItems="center"
    justifyContent="center"
    p={4}
    {...props}
  />
);

export const LoginCard = (props: ComponentProps<typeof Box>) => (
  <Box
    borderRadius="20px"
    bg="white"
    p={8}
    shadow="md"
    width="100%"
    maxW="400px"
    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
    {...props}
  />
);

export const LoginInput = (props: ComponentProps<typeof Input>) => (
  <Input
    borderRadius="10px"
    margin="5px 0px"
    {...props}
  />
);

export const LoginButton = (props: ComponentProps<typeof Button>) => (
  <Button
    borderRadius="10px"
    colorScheme="teal"
    width="100%"
    background="linear-gradient(350deg, hsla(212, 61%, 17%, 1) 0%, hsla(274, 100%, 75%, 1) 97%)"
    _hover={{
      opacity: 0.9,
    }}
    {...props}
  />
);

export const LoginHeading = (props: ComponentProps<typeof Heading>) => (
  <Heading 
    mb={6} 
    textAlign="center" 
    size="lg" 
    {...props} 
  />
);

export const SignUpText = (props: ComponentProps<typeof Text>) => (
  <Text 
    textAlign="center" 
    mt={4} 
    fontSize="sm" 
    {...props} 
  />
);

export const StyledLink = (props: ComponentProps<typeof Link>) => (
  <Link 
    color="teal.500"
    _hover={{
      textDecoration: "underline",
    }}
    {...props} 
  />
);