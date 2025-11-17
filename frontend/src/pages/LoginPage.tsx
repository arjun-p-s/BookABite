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
import React, { useState } from "react";
import { signup, login } from "../services/authService";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        const res = await signup(formData);
        console.log(res);
        alert("Signup successful!");
        setIsSignUp(false);
        setFormData({
          name: "",
          phone: "",
          email: formData.email,
          password: formData.password,
        });
      } else {
        const res = await login({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.token); 
        console.log(res);
        alert("Login successful!");
        navigate("/home");
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeading>{isSignUp ? "Sign Up" : "Sign In"}</LoginHeading>

        <VStack mt={4} gap={0}>
          {isSignUp && (
            <>
              <LoginInput
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <LoginInput
                placeholder="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}
          <LoginInput
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <LoginInput
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <LoginButton onClick={handleSubmit}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </LoginButton>
        </VStack>

        <SignUpText>
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <StyledLink href="#" onClick={() => setIsSignUp(false)}>
                Login
              </StyledLink>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <StyledLink href="#" onClick={() => setIsSignUp(true)}>
                Sign up
              </StyledLink>
            </>
          )}
        </SignUpText>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;