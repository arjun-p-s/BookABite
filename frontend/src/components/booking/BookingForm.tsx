import { Box, Button, Heading, Input, Stack, Text, Textarea, VStack } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import type { FormData } from "./types";

type BookingFormProps = {
  formData: FormData;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: () => void;
};

const BookingForm = ({ formData, onInputChange, onSubmit }: BookingFormProps) => (
  <Box bg="white" borderRadius="24px" p={{ base: 6, md: 8 }} boxShadow="0 18px 50px rgba(148,163,184,0.2)">
    <Heading fontSize="1.75rem" mb={6} color="#0f172a">
      Essential Inputs
    </Heading>
    <VStack gap={5}>
      <Box width="100%">
        <Text fontWeight="600" mb={2}>
          Name of the Guest
        </Text>
        <Input name="guestName" placeholder="Enter full name" value={formData.guestName} onChange={onInputChange} />
      </Box>
      <Stack direction={{ base: "column", md: "row" }} gap={4} width="100%">
        <Box flex="1" minW={{ base: "100%", md: "240px" }}>
          <Text fontWeight="600" mb={2}>
            Phone Number
          </Text>
          <Input name="phone" placeholder="+1 987 456 1230" value={formData.phone} onChange={onInputChange} />
        </Box>
        <Box flex="1" minW={{ base: "100%", md: "240px" }}>
          <Text fontWeight="600" mb={2}>
            Email (optional)
          </Text>
          <Input
            type="email"
            name="email"
            placeholder="guest@email.com"
            value={formData.email}
            onChange={onInputChange}
          />
        </Box>
      </Stack>
      <Stack direction={{ base: "column", md: "row" }} gap={4} width="100%">
        <Box flex="1" minW={{ base: "100%", md: "160px" }}>
          <Text fontWeight="600" mb={2}>
            Number of Guests
          </Text>
          <Input type="number" min={1} max={12} name="guests" value={formData.guests} onChange={onInputChange} />
        </Box>
        <Box flex="1" minW={{ base: "100%", md: "160px" }}>
          <Text fontWeight="600" mb={2}>
            Date of Reservation
          </Text>
          <Input type="date" name="date" value={formData.date} onChange={onInputChange} />
        </Box>
        <Box flex="1" minW={{ base: "100%", md: "160px" }}>
          <Text fontWeight="600" mb={2}>
            Time Slot
          </Text>
          <Input type="time" name="time" value={formData.time} onChange={onInputChange} />
        </Box>
      </Stack>
      <Box width="100%">
        <Text fontWeight="600" mb={2}>
          Special Requests (optional)
        </Text>
        <Textarea
          name="requests"
          placeholder="e.g., vegetarian menu, wheelchair access, birthday setup"
          value={formData.requests}
          onChange={onInputChange}
          rows={4}
        />
      </Box>
      <Button
        bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
        color="white"
        size="lg"
        w="100%"
        mt={4}
        _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 30px rgba(14,165,233,0.35)" }}
        onClick={onSubmit}
      >
        Save Reservation Draft
      </Button>
    </VStack>
  </Box>
);

export default BookingForm;

