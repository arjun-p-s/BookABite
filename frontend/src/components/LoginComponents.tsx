/** @jsxImportSource @emotion/react */
import { Box, Input, Button, Heading, Text, Link } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import type { ComponentProps } from "react";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) translateX(20px) rotate(5deg);
  }
  66% {
    transform: translateY(10px) translateX(-15px) rotate(-3deg);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const containerStyles = css`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #14b8a6 50%, #10b981 75%, #0ea5e9 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 20s ease infinite;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 12px;
    min-height: 100vh;
    align-items: flex-start;
    padding-top: 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    animation: ${float} 12s ease-in-out infinite;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -30%;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%);
    animation: ${float} 15s ease-in-out infinite reverse;
    pointer-events: none;
  }
`;

const cardStyles = css`
  border-radius: 20px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  background: #ffffff;
  box-shadow: 0 25px 70px rgba(14, 165, 233, 0.25),
              0 10px 30px rgba(14, 165, 233, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.1);
  border: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    padding: 32px 24px;
    max-width: 100%;
    border-radius: 16px;
    margin: 0 auto;
  }
  
  @media (max-width: 480px) {
    padding: 28px 20px;
    border-radius: 12px;
  }
  
  &:hover {
    box-shadow: 0 30px 80px rgba(14, 165, 233, 0.3),
                0 15px 40px rgba(14, 165, 233, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
  }
`;

const inputStyles = css`
  border-radius: 10px;
  margin: 12px 0px;
  height: 52px;
  font-size: 15px;
  border: 2px solid #e0f2fe !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f0f9ff;
  padding-left: 18px;
  font-weight: 500;
  
  @media (max-width: 480px) {
    height: 48px;
    font-size: 14px;
    margin: 10px 0px;
    padding-left: 16px;
  }
  
  &:focus {
    border-color: #0ea5e9 !important;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15),
                0 4px 12px rgba(14, 165, 233, 0.1);
    outline: none;
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
  
  &:hover:not(:focus) {
    border-color: #06b6d4 !important;
    background: #ffffff;
    transform: translateY(-1px);
  }
`;

const buttonStyles = css`
  border-radius: 10px;
  width: 100%;
  height: 52px;
  font-size: 15px;
  font-weight: 700;
  margin-top: 20px;
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 50%, #10b981 100%) !important;
  background-size: 200% 200%;
  color: white !important;
  border: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4),
              0 3px 8px rgba(14, 165, 233, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 480px) {
    height: 48px;
    font-size: 14px;
    margin-top: 16px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(14, 165, 233, 0.5),
                0 4px 12px rgba(14, 165, 233, 0.4);
    background-position: 100% 50%;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const headingStyles = css`
  margin-bottom: 40px;
  text-align: center;
  font-size: 2.5rem;
  color: #0f172a;
  font-weight: 800;
  letter-spacing: -1.5px;
  position: relative;
  animation: ${slideIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 28px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 5px;
    background: linear-gradient(90deg, #0ea5e9 0%, #14b8a6 50%, #10b981 100%);
    background-size: 200% 100%;
    border-radius: 3px;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const textStyles = css`
  text-align: center;
  margin-top: 32px;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.3px;
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-top: 24px;
  }
`;

const linkStyles = css`
  color: #0ea5e9;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  margin-left: 4px;
  
  &:hover {
    color: #14b8a6;
    text-decoration: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #0ea5e9 0%, #14b8a6 50%, #10b981 100%);
    background-size: 200% 100%;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
  }
  
  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
    animation: ${shimmer} 2s ease-in-out infinite;
  }
`;

export const LoginContainer = (props: ComponentProps<typeof Box>) => (
  <Box css={containerStyles} {...props} />
);

export const LoginCard = (props: ComponentProps<typeof Box>) => (
  <Box css={cardStyles} {...props} />
);

export const LoginInput = (props: ComponentProps<typeof Input>) => (
  <Input css={inputStyles} {...props} />
);

export const LoginButton = (props: ComponentProps<typeof Button>) => (
  <Button css={buttonStyles} {...props} />
);

export const LoginHeading = (props: ComponentProps<typeof Heading>) => (
  <Heading css={headingStyles} {...props} />
);

export const SignUpText = (props: ComponentProps<typeof Text>) => (
  <Text css={textStyles} {...props} />
);

export const StyledLink = (props: ComponentProps<typeof Link>) => (
  <Link css={linkStyles} {...props} />
);