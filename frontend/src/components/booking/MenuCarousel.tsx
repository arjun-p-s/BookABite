import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { LuCheck, LuChevronLeft, LuChevronRight, LuPlus } from "react-icons/lu";
import type { FoodItem } from "./types";

type MenuCarouselProps = {
  items: FoodItem[];
  selectedFoods: FoodItem[];
  onToggleFood: (item: FoodItem) => void;
};

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MenuCarousel = ({
  items,
  selectedFoods,
  onToggleFood,
}: MenuCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use Chakra's useBreakpointValue to get actual responsive value
  const itemsToShow = useBreakpointValue({ base: 1, md: 2 }) ?? 1;
  const hasMultipleCards = itemsToShow > 1;

  const nextSlide = () => {
    const maxIndex = Math.max(items.length - itemsToShow, 0);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" overflow="hidden">
      <Heading fontSize={{ base: "1.5rem", md: "1.75rem" }} mb={2} color="#0f172a">
        Curated Menu Highlights
      </Heading>
      <Text color="gray.600" mb={{ base: 4, md: 5 }} fontSize={{ base: "sm", md: "md" }}>
        Signature plates handpicked by our chefs
      </Text>

      <Box position="relative" mx={{ base: 4, md: 0 }}>
        <Box
          overflow="visible"
          borderRadius={{ base: "16px", md: "20px" }}
          bg="transparent"
        >
          <Box
            display="flex"
            gap={hasMultipleCards ? 4 : 0}
            transform={`translateX(-${currentIndex * (100 / itemsToShow)}%)`}
            transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
            mx={{ base: "-1rem", md: 0 }}
            px={{ base: "1rem", md: 0 }}
          >
            {items.map((item, index) => {
              const isSelected = selectedFoods.some((food) => food.id === item.id);
              return (
                <Box
                  key={item.id}
                  flex={`0 0 ${100 / itemsToShow}%`}
                  maxW={`${100 / itemsToShow}%`}
                  px={{ base: 2, md: 0 }}
                  display="flex"
                >
                  <Box
                    width="100%"
                    borderRadius={{ base: "16px", md: "20px" }}
                    overflow="hidden"
                    border="1px solid rgba(15,23,42,0.08)"
                    boxShadow={
                      isSelected
                        ? "0 12px 28px rgba(16,185,129,0.25)"
                        : "0 8px 20px rgba(15,23,42,0.08)"
                    }
                    bg="white"
                    display="flex"
                    flexDirection="column"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "0 16px 32px rgba(15,23,42,0.12)",
                    }}
                  >
                    <Box
                      h={{ base: "200px", md: "180px" }}
                      backgroundImage={`url(${item.image})`}
                      backgroundSize="cover"
                      backgroundPosition="center"
                      position="relative"
                    >
                      <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        bg="rgba(14,165,233,0.95)"
                        color="white"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="600"
                      >
                        Chef favorite
                      </Badge>
                    </Box>
                    <Box p={{ base: 4, md: 4 }} display="flex" flexDirection="column" flex="1">
                      <HStack justify="space-between" align="flex-start" mb={2}>
                        <Heading fontSize={{ base: "lg", md: "lg" }} noOfLines={1}>
                          {item.name}
                        </Heading>
                        <Text
                          color="#0ea5e9"
                          fontWeight="700"
                          fontSize={{ base: "lg", md: "lg" }}
                          flexShrink={0}
                          ml={2}
                        >
                          ${item.price}
                        </Text>
                      </HStack>
                      <Text
                        color="gray.600"
                        fontSize={{ base: "sm", md: "sm" }}
                        flex="1"
                        mb={3}
                        noOfLines={2}
                      >
                        {item.description}
                      </Text>
                      <Button
                        mt="auto"
                        width="100%"
                        variant={isSelected ? "solid" : "outline"}
                        colorScheme={isSelected ? "teal" : "cyan"}
                        onClick={() => onToggleFood(item)}
                        size={{ base: "md", md: "sm" }}
                      >
                        <HStack justify="center" gap={2}>
                          {isSelected ? <LuCheck size={16} /> : <LuPlus size={16} />}
                          <Text fontSize={{ base: "sm", md: "sm" }}>
                            {isSelected ? "Added to booking" : "Add to booking"}
                          </Text>
                        </HStack>
                      </Button>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Navigation Buttons */}
        <IconButton
          aria-label="Previous"
          icon={<LuChevronLeft />}
          position="absolute"
          top="50%"
          left={{ base: "0px", md: "-14px" }}
          transform="translateY(-50%)"
          bg="white"
          color="#0ea5e9"
          borderRadius="full"
          boxShadow="0 8px 20px rgba(15,23,42,0.2)"
          onClick={prevSlide}
          isDisabled={currentIndex === 0}
          _hover={{ bg: "#f0f9ff" }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
          zIndex={2}
          size={{ base: "sm", md: "md" }}
        />
        <IconButton
          aria-label="Next"
          icon={<LuChevronRight />}
          position="absolute"
          top="50%"
          right={{ base: "0px", md: "-14px" }}
          transform="translateY(-50%)"
          bg="white"
          color="#0ea5e9"
          borderRadius="full"
          boxShadow="0 8px 20px rgba(15,23,42,0.2)"
          onClick={nextSlide}
          isDisabled={currentIndex >= Math.max(items.length - itemsToShow, 0)}
          _hover={{ bg: "#f0f9ff" }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
          zIndex={2}
          size={{ base: "sm", md: "md" }}
        />
      </Box>
    </Box>
  );
};

export default MenuCarousel;