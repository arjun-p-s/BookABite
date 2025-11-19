/** @jsxImportSource @emotion/react */
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import type { Message } from "./types";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

type ChatBodyProps = {
  messages: Message[];
  isLoading: boolean;
};

const ChatBody = ({ messages, isLoading }: ChatBodyProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <Box
      flex="1"
      overflowY="auto"
      p={{ base: 4, md: 5 }}
      bg="gray.50"
      css={css`
        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-track {
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.3);
          border-radius: 3px;
        }
        &::-webkit-scrollbar-thumb:hover {
          background: rgba(14, 165, 233, 0.5);
        }
      `}
    >
      {messages.length === 0 ? (
        <VStack
          justify="center"
          align="center"
          height="100%"
          gap={3}
          color="gray.500"
        >
          <Text fontSize="lg" fontWeight="600">
            👋 Welcome to BookaBite AI!
          </Text>
          <Text fontSize="sm" textAlign="center" maxW="280px">
            Ask me about menu items, reservations, restaurant hours, or anything else!
          </Text>
        </VStack>
      ) : (
        <VStack gap={3} align="stretch">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <Box
              maxW="70%"
              borderRadius="16px"
              p={4}
              bg="gray.100"
              borderBottomLeftRadius="4px"
            >
              <HStack gap={1}>
                <Box
                  width="8px"
                  height="8px"
                  borderRadius="50%"
                  bg="gray.400"
                  css={css`
                    animation: ${bounce} 1.4s ease-in-out infinite;
                    animation-delay: 0s;
                  `}
                />
                <Box
                  width="8px"
                  height="8px"
                  borderRadius="50%"
                  bg="gray.400"
                  css={css`
                    animation: ${bounce} 1.4s ease-in-out infinite;
                    animation-delay: 0.2s;
                  `}
                />
                <Box
                  width="8px"
                  height="8px"
                  borderRadius="50%"
                  bg="gray.400"
                  css={css`
                    animation: ${bounce} 1.4s ease-in-out infinite;
                    animation-delay: 0.4s;
                  `}
                />
              </HStack>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </VStack>
      )}
    </Box>
  );
};

export default ChatBody;

