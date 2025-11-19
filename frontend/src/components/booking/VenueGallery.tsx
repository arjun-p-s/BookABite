import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";
import type { GalleryImage } from "./types";

type VenueGalleryProps = {
  images: GalleryImage[];
};

const floatGlow = keyframes`
  from {
    box-shadow: 0 15px 30px rgba(14,165,233,0.15);
    transform: translateY(0);
  }
  to {
    box-shadow: 0 25px 45px rgba(14,165,233,0.25);
    transform: translateY(-6px);
  }
`;

const VenueGallery = ({ images }: VenueGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(id);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" height="100%">
      <Heading fontSize={{ base: "1.5rem", md: "1.75rem" }} mb={2} color="#0f172a">
        Venue Highlights
      </Heading>
      <Text color="gray.600" mb={6} fontSize={{ base: "sm", md: "md" }}>
        Discover mood-led dining zones curated for celebrations, intimate dinners, and business meetups.
      </Text>

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        gap={{ base: 4, md: 6 }}
        maxW="full"
      >
        {images.map((image, idx) => {
          const isActive = idx === currentImage;
          return (
            <Box
              key={image.id}
              borderRadius="28px"
              overflow="hidden"
              minH={{ base: "240px", md: "280px" }}
              position="relative"
              backgroundImage={`url(${image.url})`}
              backgroundSize="cover"
              backgroundPosition="center"
              cursor="pointer"
              transition="all 0.4s ease"
              border={isActive ? "2px solid rgba(14,165,233,0.6)" : "2px solid transparent"}
              transform={isActive ? "scale(1)" : "scale(0.96)"}
              opacity={isActive ? 1 : 0.85}
              animation={isActive ? `${floatGlow} 2s ease-in-out infinite alternate` : undefined}
              onClick={() => setCurrentImage(idx)}
            >
              <Box
                position="absolute"
                inset="0"
                bgGradient={
                  isActive
                    ? "linear(to-t, rgba(15,23,42,0.85), transparent)"
                    : "linear(to-t, rgba(15,23,42,0.65), transparent)"
                }
              />
              <Box position="absolute" bottom="0" left="0" right="0" p={{ base: 4, md: 5 }} color="white">
                <Heading fontSize={{ base: "lg", md: "xl" }}>{image.caption}</Heading>
                <Text fontSize={{ base: "sm", md: "md" }} opacity={0.85}>
                  Immersive ambience from every angle
                </Text>
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>

      <Flex mt={6} justify="center" gap={3} wrap="wrap">
        {images.map((image, idx) => (
          <Button
            key={image.id}
            size="sm"
            borderRadius="full"
            variant={idx === currentImage ? "solid" : "outline"}
            bg={idx === currentImage ? "linear-gradient(90deg, #0ea5e9, #14b8a6)" : "transparent"}
            color={idx === currentImage ? "white" : "gray.500"}
            borderColor="rgba(14,165,233,0.4)"
            onClick={() => setCurrentImage(idx)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button size="sm" borderRadius="full" variant="ghost" onClick={prevImage}>
          Prev
        </Button>
        <Button
          size="sm"
          borderRadius="full"
          bg="linear-gradient(90deg, #0ea5e9, #14b8a6)"
          color="white"
          _hover={{ opacity: 0.9 }}
          onClick={nextImage}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default VenueGallery;
