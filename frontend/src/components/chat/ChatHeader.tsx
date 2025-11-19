/** @jsxImportSource @emotion/react */
import { Box, Heading, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuX } from "react-icons/lu";

type ChatHeaderProps = {
  onClose: () => void;
};

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <Box
      bgGradient="linear(135deg, #0ea5e9 0%, #14b8a6 100%)"
      p={{ base: 4, md: 5 }}
      color="white"
      css={css`
        animation: ${slideIn} 0.3s ease-out;
      `}
    >
      <HStack justify="space-between" align="flex-start">
        <HStack gap={3} flex="1">
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          >
            <Text fontSize="20px" fontWeight="800" bgGradient="linear(135deg, #0ea5e9, #14b8a6)" bgClip="text">
              BA
            </Text>
          </Box>
          <VStack align="flex-start" gap={0} flex="1">
            <Heading fontSize={{ base: "lg", md: "xl" }} fontWeight="700">
              BookaBite AI Assistant
            </Heading>
            <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.9}>
              Here to help you book your table!
            </Text>
          </VStack>
        </HStack>
        <IconButton
          aria-label="Close chat"
          onClick={onClose}
          variant="ghost"
          color="white"
          _hover={{ bg: "rgba(255,255,255,0.2)" }}
          size="sm"
          borderRadius="8px"
        >
          <LuX size={20} />
        </IconButton>
      </HStack>
    </Box>
  );
};

export default ChatHeader;

