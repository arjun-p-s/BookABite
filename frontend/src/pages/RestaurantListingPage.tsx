import { Box, Container, Stack } from "@chakra-ui/react";
import ListingFilters from "../components/listing/ListingFilters";
import ListingHero from "../components/listing/ListingHero";
import RestaurantGrid from "../components/listing/RestaurantGrid";

const RestaurantListingPage = () => {
  return (
    <Box bgGradient="linear(to-b, #f8fafc, #ffffff)" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="1200px" px={{ base: 4, md: 6 }}>
        <Stack gap={{ base: 6, md: 10 }}>
          <ListingHero />
          <ListingFilters />
          <RestaurantGrid />
        </Stack>
      </Container>
    </Box>
  );
};

export default RestaurantListingPage;

