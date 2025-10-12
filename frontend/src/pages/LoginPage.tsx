import { VStack } from "@chakra-ui/react";
import {
  LoginContainer,
  LoginCard,
  LoginInput,
  LoginButton,
  LoginHeading,
  SignUpText,
  StyledLink,
} from "../components/LoginComponents";

const LoginPage = () => {
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeading>Login</LoginHeading>

        <VStack mt={4} gap={0}>
          <LoginInput placeholder="Email" type="email" />
          <LoginInput placeholder="Password" type="password" />
          <LoginButton>Sign In</LoginButton>
        </VStack>

        <SignUpText>
          Don't have an account? <StyledLink href="#">Sign up</StyledLink>
        </SignUpText>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
