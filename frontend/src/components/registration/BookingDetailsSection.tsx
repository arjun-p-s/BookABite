/** @jsxImportSource @emotion/react */
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import { LuPlus, LuX } from "react-icons/lu";
import type { RegistrationFormData, TableType } from "./types";

type BookingDetailsSectionProps = {
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

const BookingDetailsSection = ({
  formData,
  onInputChange,
}: BookingDetailsSectionProps) => {
  const addTableType = () => {
    const newTable: TableType = {
      id: Date.now().toString(),
      type: "",
      capacity: "",
      count: "",
    };
    onInputChange("tableTypes", [...formData.tableTypes, newTable]);
  };

  const updateTableType = (id: string, field: keyof TableType, value: string) => {
    const updated = formData.tableTypes.map((table) =>
      table.id === id ? { ...table, [field]: value } : table
    );
    onInputChange("tableTypes", updated);
  };

  const removeTableType = (id: string) => {
    onInputChange(
      "tableTypes",
      formData.tableTypes.filter((table) => table.id !== id)
    );
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
        Booking Details
      </Heading>

      <VStack gap={5} align="stretch">
        <Box>
          <Text fontWeight="600" mb={2}>Total Seating Capacity *</Text>
          <Input
            type="number"
            placeholder="e.g., 120"
            value={formData.totalSeatingCapacity}
            onChange={(e) => onInputChange("totalSeatingCapacity", e.target.value)}
            borderRadius="12px"
          />
        </Box>

        <Box>
          <HStack justify="space-between" mb={3}>
            <Text fontWeight="600">Table Types *</Text>
            <Button
              size="sm"
              colorPalette="cyan"
              onClick={addTableType}
              borderRadius="12px"
            >
              <HStack gap={2}>
                <LuPlus size={16} />
                <Text>Add Table Type</Text>
              </HStack>
            </Button>
          </HStack>
          <VStack gap={3} align="stretch">
            {formData.tableTypes.map((table) => (
              <Box
                key={table.id}
                p={4}
                border="1px solid rgba(14,165,233,0.2)"
                borderRadius="12px"
                bg="rgba(14,165,233,0.02)"
              >
                <HStack mb={3} justify="flex-end">
                  <Button
                    size="xs"
                    colorPalette="red"
                    variant="ghost"
                    onClick={() => removeTableType(table.id)}
                  >
                    <LuX size={16} />
                  </Button>
                </HStack>
                <Stack direction={{ base: "column", md: "row" }} gap={3}>
                  <Box flex="1">
                    <Text fontSize="sm" color="gray.600" mb={1}>Table Type</Text>
                    <Input
                      placeholder="e.g., 2-seater"
                      value={table.type}
                      onChange={(e) => updateTableType(table.id, "type", e.target.value)}
                      borderRadius="12px"
                      size="sm"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" color="gray.600" mb={1}>Capacity per Table</Text>
                    <Input
                      type="number"
                      placeholder="e.g., 2"
                      value={table.capacity}
                      onChange={(e) => updateTableType(table.id, "capacity", e.target.value)}
                      borderRadius="12px"
                      size="sm"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" color="gray.600" mb={1}>Number of Tables</Text>
                    <Input
                      type="number"
                      placeholder="e.g., 10"
                      value={table.count}
                      onChange={(e) => updateTableType(table.id, "count", e.target.value)}
                      borderRadius="12px"
                      size="sm"
                    />
                  </Box>
                </Stack>
              </Box>
            ))}
            {formData.tableTypes.length === 0 && (
              <Text color="gray.500" textAlign="center" py={4}>
                Click "Add Table Type" to get started
              </Text>
            )}
          </VStack>
        </Box>

        <Box>
          <Text fontWeight="600" mb={2}>Max Booking Per Slot *</Text>
          <Input
            type="number"
            placeholder="e.g., 5"
            value={formData.maxBookingPerSlot}
            onChange={(e) => onInputChange("maxBookingPerSlot", e.target.value)}
            borderRadius="12px"
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default BookingDetailsSection;

