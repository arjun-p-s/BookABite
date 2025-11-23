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

type AuthFormData = {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
};

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "user", // ⭐ Changed default to "user"
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        const res = await signup({
          ...formData,
          role: "user", // ⭐ Always send "user" for signup
        });
        console.log(res);
        alert("Signup successful!");
        setIsSignUp(false);
        setFormData({
          name: "",
          phone: "",
          email: formData.email,
          password: formData.password,
          role: "user",
        });
      } else {
        const res = await login({
          email: formData.email,
          password: formData.password,
          role: formData.role, // ⭐ Send role in login
        });
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user)); // ⭐ Store user data
        console.log(res);
        alert("Login successful!");

        // ⭐ Redirect based on role
        if (res.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong"
      );
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

          {/* ⭐ Role Selector - Only shown in Login */}
          {!isSignUp && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="chakra-input css-s98c7e"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}

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
