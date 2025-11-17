import { Box } from "@chakra-ui/react";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedRestaurants from "../components/home/FeaturedRestaurants";
import PopularCategories from "../components/home/PopularCategories";
import AvailabilityChecker from "../components/home/AvailabilityChecker";
import OffersDeals from "../components/home/OffersDeals";
import RestaurantCollections from "../components/home/RestaurantCollections";
import ReviewsTestimonials from "../components/home/ReviewsTestimonials";
import LoyaltySection from "../components/home/LoyaltySection";
import MobileAppPromo from "../components/home/MobileAppPromo";
import PartnerSection from "../components/home/PartnerSection";
import SafetyHygiene from "../components/home/SafetyHygiene";

const HomePage = () => {
  return (
    <Box width="100%" bg="white">
      <HeroSection />
      <HowItWorks />
      <FeaturedRestaurants />
      <PopularCategories />
      <AvailabilityChecker />
      <OffersDeals />
      <RestaurantCollections />
      <ReviewsTestimonials />
      <LoyaltySection />
      <MobileAppPromo />
      <PartnerSection />
      <SafetyHygiene />
    </Box>
  );
};

export default HomePage;
