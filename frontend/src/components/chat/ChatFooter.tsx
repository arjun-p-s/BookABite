/** @jsxImportSource @emotion/react */
import { Box, HStack, IconButton, Input } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { useState } from "react";
import { LuMic, LuSend } from "react-icons/lu";

type ChatFooterProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
};

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ChatFooter = ({ onSendMessage, isLoading }: ChatFooterProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      p={{ base: 3, md: 4 }}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.200"
      css={css`
        animation: ${slideUp} 0.3s ease-out;
      `}
    >
      <HStack gap={2}>
        <Input
          placeholder="Ask about menu, reservations…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          borderRadius="12px"
          size={{ base: "md", md: "lg" }}
          disabled={isLoading}
          _focus={{
            borderColor: "#0ea5e9",
            boxShadow: "0 0 0 1px #0ea5e9",
          }}
        />
        <IconButton
          aria-label="Voice input"
          variant="ghost"
          colorScheme="cyan"
          borderRadius="12px"
          size={{ base: "md", md: "lg" }}
        >
          <LuMic size={20} />
        </IconButton>
        <IconButton
          aria-label="Send message"
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
          bgGradient="linear(135deg, #0ea5e9 0%, #14b8a6 100%)"
          color="white"
          borderRadius="12px"
          size={{ base: "md", md: "lg" }}
          _hover={{
            bgGradient: "linear(135deg, #14b8a6 0%, #10b981 100%)",
            transform: "scale(1.05)",
          }}
          _disabled={{
            opacity: 0.5,
            cursor: "not-allowed",
          }}
        >
          <LuSend size={20} />
        </IconButton>
      </HStack>
    </Box>
  );
};

export default ChatFooter;

