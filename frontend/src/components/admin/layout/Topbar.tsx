import {
    Flex,
    IconButton,
    Text,
    HStack,
    Badge,
    Box,
  } from "@chakra-ui/react";
  import { LuMenu, LuBell, LuUser } from "react-icons/lu";
  import { useNavigate } from "react-router-dom";
  
  type TopbarProps = {
    onMenuClick: () => void;
  };
  
  const Topbar = ({ onMenuClick }: TopbarProps) => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };
  
    return (
      <Flex
        as="header"
        h="64px"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        px={{ base: 4, md: 6 }}
        align="center"
        justify="space-between"
        position="sticky"
        top={0}
        zIndex={10}
      >
        {/* Left: Menu Button (Mobile) + Title */}
        <HStack gap={4}>
          <IconButton
            aria-label="Open menu"
            display={{ base: "flex", lg: "none" }}
            variant="ghost"
            onClick={onMenuClick}
          >
            <LuMenu />
          </IconButton>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="600"
            color="gray.700"
          >
            Admin Panel
          </Text>
        </HStack>
  
        {/* Right: Notifications + User Menu */}
        <HStack gap={2}>
          {/* Notifications */}
          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              borderRadius="full"
            >
              <LuBell />
            </IconButton>
            <Badge
              position="absolute"
              top="2px"
              right="2px"
              colorPalette="red"
              borderRadius="full"
              fontSize="xs"
              px={1}
            >
              3
            </Badge>
          </Box>
  
          {/* User Avatar - Custom Circle */}
          <HStack
            gap={2}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
            onClick={handleLogout}
            px={2}
            py={1}
            borderRadius="md"
            title="Click to logout"
            transition="opacity 0.2s"
          >
            <Flex
              w="32px"
              h="32px"
              bg="cyan.500"
              borderRadius="full"
              align="center"
              justify="center"
              color="white"
              fontWeight="600"
              fontSize="sm"
            >
              <LuUser size={18} />
            </Flex>
            <Text
              fontSize="sm"
              fontWeight="500"
              display={{ base: "none", md: "block" }}
            >
              Admin
            </Text>
          </HStack>
        </HStack>
      </Flex>
    );
  };
  
  export default Topbar;