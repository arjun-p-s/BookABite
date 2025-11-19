/** @jsxImportSource @emotion/react */
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { useRef, useState } from "react";
import { LuFileText, LuX } from "react-icons/lu";
import type { RegistrationFormData } from "./types";

type OwnerDetailsSectionProps = {
  formData: RegistrationFormData;
  onInputChange: (field: keyof RegistrationFormData, value: any) => void;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const OwnerDetailsSection = ({
  formData,
  onInputChange,
}: OwnerDetailsSectionProps) => {
  const idProofInputRef = useRef<HTMLInputElement>(null);
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);

  const handleIdProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onInputChange("ownerIdProof", file);
      const reader = new FileReader();
      reader.onloadend = () => setIdProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="24px"
      p={{ base: 6, md: 8 }}
      boxShadow="0 10px 30px rgba(14,165,233,0.1)"
      css={css`
        animation: ${fadeIn} 0.5s ease-out;
      `}
    >
      <Heading fontSize="1.75rem" mb={6} color="#0f172a">
        Owner Details
      </Heading>

      <VStack gap={5} align="stretch">
        <Box>
          <Text fontWeight="600" mb={2}>Owner Name *</Text>
          <Input
            placeholder="Full name"
            value={formData.ownerName}
            onChange={(e) => onInputChange("ownerName", e.target.value)}
            borderRadius="12px"
          />
        </Box>

        <Box>
          <Text fontWeight="600" mb={3}>Owner ID Proof *</Text>
          <Box
            border="2px dashed rgba(14,165,233,0.3)"
            borderRadius="16px"
            p={6}
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: "#0ea5e9", bg: "rgba(14,165,233,0.05)" }}
            transition="all 0.3s ease"
            onClick={() => idProofInputRef.current?.click()}
          >
            {idProofPreview ? (
              <Box position="relative" display="inline-block">
                <img
                  src={idProofPreview}
                  alt="ID Proof preview"
                  style={{ maxHeight: "200px", borderRadius: "12px" }}
                />
                <Button
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  size="sm"
                  borderRadius="full"
                  bg="red.500"
                  color="white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdProofPreview(null);
                    onInputChange("ownerIdProof", null);
                  }}
                >
                  <LuX />
                </Button>
              </Box>
            ) : (
              <VStack gap={2}>
                <LuFileText size={32} color="#0ea5e9" />
                <Text color="gray.600">Click to upload ID proof (PDF or Image)</Text>
                <Text fontSize="sm" color="gray.500">
                  Accepted: PDF, JPG, PNG (Max 5MB)
                </Text>
              </VStack>
            )}
            <Input
              ref={idProofInputRef}
              type="file"
              accept=".pdf,image/*"
              display="none"
              onChange={handleIdProofUpload}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default OwnerDetailsSection;

