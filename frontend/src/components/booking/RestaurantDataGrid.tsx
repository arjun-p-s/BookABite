import { Box, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import type { RestaurantDataBlock } from "./types";

type RestaurantDataGridProps = {
  data: RestaurantDataBlock[];
};

const RestaurantDataGrid = ({ data }: RestaurantDataGridProps) => (
  <Box>
    <Heading fontSize="1.75rem" mb={4} color="#0f172a">
      Restaurant Data Needed
    </Heading>
    <SimpleGrid columns={{ base: 1, md: 2,  lg:2}} gap={6}>
      {data.map((item) => (
        <Box
          key={item.title}
          bg="white"
          p={6}
          borderRadius="20px"
          boxShadow="0 16px 40px rgba(148,163,184,0.2)"
          border="1px solid rgba(14,165,233,0.1)"
        >
          <Heading fontSize="1.25rem" mb={3} color="#0ea5e9">
            {item.title}
          </Heading>
          <VStack align="flex-start" gap={2}>
            {item.details.map((detail) => (
              <Text key={detail} color="gray.600">
                {detail}
              </Text>
            ))}
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
);

export default RestaurantDataGrid;

