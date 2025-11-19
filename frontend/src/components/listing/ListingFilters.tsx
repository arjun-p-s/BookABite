import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { LuFilter, LuSearch } from "react-icons/lu";

const cuisineFilters = ["All", "Seafood", "Grill", "Vegan", "Patisserie", "Asian Fusion"];
const priceFilters = ["$", "$$", "$$$"];

const ListingFilters = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      bg="white"
      borderRadius="24px"
      p={{ base: 5, md: 6 }}
      boxShadow="0 18px 45px rgba(15,23,42,0.15)"
    >
      <Stack gap={4}>
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }}>
          <HStack gap={3}>
            <Icon as={LuFilter} color="#0ea5e9" boxSize={5} />
            <Text fontWeight="600" fontSize="lg" color="#0f172a">
              Refine your search
            </Text>
          </HStack>
          <Button variant="ghost" color="#0ea5e9" px={0} display={{ base: "none", md: "inline-flex" }}>
            Clear filters
          </Button>
        </Flex>

        <Stack direction={{ base: "column", md: "row" }} gap={3}>
          <Box position="relative" flex="1">
            <Input
              placeholder="Search by name or vibe"
              borderRadius="16px"
              bg="gray.50"
              pl="44px"
              height="48px"
            />
            <Icon
              as={LuSearch}
              position="absolute"
              left="16px"
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
            />
          </Box>
          {isMobile && (
            <Button variant="ghost" color="#0ea5e9" width="full">
              Clear filters
            </Button>
          )}
        </Stack>

        <Stack direction={{ base: "column", md: "row" }} gap={4}>
          <Box>
            <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
              Cuisine
            </Text>
            <HStack gap={2} flexWrap="wrap">
              {cuisineFilters.map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  borderRadius="full"
                  variant={filter === "All" ? "solid" : "outline"}
                  bg={filter === "All" ? "rgba(14,165,233,0.15)" : "white"}
                  color={filter === "All" ? "#0ea5e9" : "gray.600"}
                  borderColor="rgba(148,163,184,0.4)"
                >
                  {filter}
                </Button>
              ))}
            </HStack>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
              Price
            </Text>
            <HStack gap={2}>
              {priceFilters.map((filter, idx) => (
                <Button
                  key={filter}
                  size="sm"
                  borderRadius="full"
                  variant={idx === 1 ? "solid" : "outline"}
                  bg={idx === 1 ? "rgba(16,185,129,0.2)" : "white"}
                  color={idx === 1 ? "#0f172a" : "gray.600"}
                  borderColor="rgba(148,163,184,0.4)"
                >
                  {filter}
                </Button>
              ))}
            </HStack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ListingFilters;

