import { Box, Button, Spinner, Text } from "@chakra-ui/react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  uploadProgress: string;
  onSubmit: () => void;
}

const SubmitButton = ({ isSubmitting, isEditMode, uploadProgress, onSubmit }: SubmitButtonProps) => {
  return (
    <Box
      bg="white"
      borderRadius="24px"
      p={{ base: 6, md: 8 }}
      boxShadow="0 10px 30px rgba(14,165,233,0.1)"
      position="sticky"
      bottom={0}
      zIndex={10}
    >
      <Button
        width="100%"
        size="lg"
        bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
        color="white"
        _hover={{
          bgGradient: "linear(to-r, #14b8a6, #10b981)",
          transform: isSubmitting ? "none" : "translateY(-2px)",
          boxShadow: "0 12px 30px rgba(14,165,233,0.35)",
        }}
        onClick={onSubmit}
        borderRadius="12px"
        fontWeight="700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Box display="flex" alignItems="center" gap={3}>
            <Spinner size="sm" />
            <Text>{uploadProgress || "Processing..."}</Text>
          </Box>
        ) : (
          isEditMode ? "Update Restaurant" : "Submit Registration"
        )}
      </Button>
      
      {isSubmitting && (
        <Text 
          textAlign="center" 
          mt={3} 
          fontSize="sm" 
          color="gray.600"
        >
          Please wait, this may take a moment...
        </Text>
      )}
    </Box>
  );
};

export default SubmitButton;