/** @jsxImportSource @emotion/react */
import { Box, HStack, Text } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import type { Message } from "./types";

type ChatMessageProps = {
  message: Message;
};

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === "user";

  return (
    <HStack
      justify={isUser ? "flex-end" : "flex-start"}
      align="flex-start"
      gap={2}
      width="100%"
      css={css`
        animation: ${fadeInUp} 0.3s ease-out;
      `}
    >
      {!isUser && (
        <Box
          width="32px"
          height="32px"
          borderRadius="50%"
          bgGradient="linear(135deg, #0ea5e9, #14b8a6)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Text fontSize="14px" fontWeight="700" color="white">
            AI
          </Text>
        </Box>
      )}
      <Box
        maxW={{ base: "75%", md: "70%" }}
        borderRadius="16px"
        p={{ base: 3, md: 4 }}
        bg={isUser ? "linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)" : "gray.100"}
        color={isUser ? "white" : "gray.800"}
        boxShadow={isUser ? "0 4px 12px rgba(14,165,233,0.25)" : "0 2px 8px rgba(0,0,0,0.1)"}
        css={css`
          word-wrap: break-word;
          ${isUser
            ? `
            border-bottom-right-radius: 4px;
          `
            : `
            border-bottom-left-radius: 4px;
          `}
        `}
      >
        <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.5">
          {message.text}
        </Text>
        <Text
          fontSize="xs"
          opacity={0.7}
          mt={2}
          textAlign={isUser ? "right" : "left"}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Box>
      {isUser && (
        <Box
          width="32px"
          height="32px"
          borderRadius="50%"
          bg="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Text fontSize="14px" fontWeight="700" color="gray.600">
            You
          </Text>
        </Box>
      )}
    </HStack>
  );
};

export default ChatMessage;

