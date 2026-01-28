import { Box, VStack, Spinner, Text } from "@chakra-ui/react";

const LoadingState = () => {
  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bgGradient="linear(to-b, #f0f9ff, #fff)"
    >
      <VStack gap={4}>
        <Spinner size="xl" color="cyan.500"  />
        <Text fontSize="lg" color="gray.600">Loading restaurant data...</Text>
      </VStack>
    </Box>
  );
};

export default LoadingState;