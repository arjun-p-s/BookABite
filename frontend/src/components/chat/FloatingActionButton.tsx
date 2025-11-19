/** @jsxImportSource @emotion/react */
import { Box, IconButton } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuMessageCircle } from "react-icons/lu";

type FloatingActionButtonProps = {
  onClick: () => void;
  isOpen: boolean;
};

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const fabStyles = css`
  position: fixed;
  bottom: 100px;
  right: 24px;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    bottom: 80px;
    right: 16px;
  }
  
  &:hover {
    transform: scale(1.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0ea5e9, #14b8a6);
    opacity: 0.3;
    animation: ${pulse} 2s ease-in-out infinite;
    z-index: -1;
  }
`;

const FloatingActionButton = ({ onClick, isOpen }: FloatingActionButtonProps) => {
  if (isOpen) return null;

  return (
    <Box css={fabStyles}>
      <IconButton
        aria-label="Open AI Chat"
        onClick={onClick}
        size="lg"
        width="60px"
        height="60px"
        borderRadius="50%"
        bgGradient="linear(135deg, #0ea5e9 0%, #14b8a6 100%)"
        color="white"
        boxShadow="0 8px 24px rgba(14, 165, 233, 0.4)"
        _hover={{
          bgGradient: "linear(135deg, #14b8a6 0%, #10b981 100%)",
          boxShadow: "0 12px 32px rgba(14, 165, 233, 0.5)",
          transform: "scale(1.1)",
        }}
        _active={{
          transform: "scale(0.95)",
        }}
        css={css`
          animation: ${float} 3s ease-in-out infinite;
        `}
      >
        <LuMessageCircle size={28} />
      </IconButton>
    </Box>
  );
};

export default FloatingActionButton;

