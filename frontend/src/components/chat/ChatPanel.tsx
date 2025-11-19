/** @jsxImportSource @emotion/react */
import { Box, VStack } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import type { Message } from "./types";

type ChatPanelProps = {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
};

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideInUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const ChatPanel = ({
  isOpen,
  messages,
  isLoading,
  onClose,
  onSendMessage,
}: ChatPanelProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        inset="0"
        bg="blackAlpha.600"
        zIndex={999}
        onClick={onClose}
        css={css`
          animation: fadeIn 0.3s ease-out;
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      />
      
      {/* Chat Panel */}
      <Box
        position="fixed"
        right="0"
        top="0"
        width={{ base: "100%", md: "420px" }}
        height={{ base: "80%", md: "100%" }}
        bottom={{ base: "0", md: "auto" }}
        bg="white"
        boxShadow="-4px 0 24px rgba(0,0,0,0.15)"
        zIndex={1000}
        display="flex"
        flexDirection="column"
        css={css`
          @media (min-width: 768px) {
            animation: ${slideInRight} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @media (max-width: 767px) {
            animation: ${slideInUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
          }
        `}
      >
        <VStack height="100%" align="stretch" gap={0}>
          <ChatHeader onClose={onClose} />
          <ChatBody messages={messages} isLoading={isLoading} />
          <ChatFooter onSendMessage={onSendMessage} isLoading={isLoading} />
        </VStack>
      </Box>
    </>
  );
};

export default ChatPanel;

