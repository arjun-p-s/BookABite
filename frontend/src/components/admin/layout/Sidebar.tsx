import {
    Box,
    VStack,
    Text,
    Icon,
    Flex,
    Heading,
    IconButton,
  } from "@chakra-ui/react";
  import {
    LuLayoutDashboard,
    LuStore,
    LuCalendar,
    LuShoppingBag,
    LuClock,
    LuX,
  } from "react-icons/lu";
  import { Link, useLocation } from "react-router-dom";
  
  type SidebarProps = {
    onClose: () => void;
  };
  
  const menuItems = [
    { icon: LuLayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: LuStore, label: "Restaurants", path: "/admin/restaurants" },
    { icon: LuCalendar, label: "Bookings", path: "/admin/bookings" },
    { icon: LuShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: LuClock, label: "Time Slots", path: "/admin/timeslots" },
  ];
  
  const Sidebar = ({ onClose }: SidebarProps) => {
    const location = useLocation();
  
    return (
      <Box bg="white" h="100%" borderRight="1px" borderColor="gray.200">
        {/* Header */}
        <Flex
          h="64px"
          align="center"
          justify="space-between"
          px={6}
          borderBottom="1px"
          borderColor="gray.200"
        >
          <Heading
            fontSize="xl"
            bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
            bgClip="text"
            fontWeight="800"
          >
            BookABite
          </Heading>
          <IconButton
            aria-label="Close menu"
            display={{ base: "flex", lg: "none" }}
            variant="ghost"
            onClick={onClose}
            size="sm"
          >
            <LuX />
          </IconButton>
        </Flex>
  
        {/* Menu Items */}
        <VStack gap={1} align="stretch" p={4}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={onClose}>
                <Flex
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  borderRadius="lg"
                  bg={isActive ? "cyan.50" : "transparent"}
                  color={isActive ? "cyan.600" : "gray.700"}
                  fontWeight={isActive ? "600" : "500"}
                  transition="all 0.2s"
                  _hover={{
                    bg: isActive ? "cyan.50" : "gray.50",
                    transform: "translateX(4px)",
                  }}
                  cursor="pointer"
                >
                  <Icon as={item.icon} boxSize={5} />
                  <Text fontSize="sm">{item.label}</Text>
                </Flex>
              </Link>
            );
          })}
        </VStack>
  
        {/* Footer */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={4}
          borderTop="1px"
          borderColor="gray.200"
        >
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Admin Dashboard v1.0
          </Text>
        </Box>
      </Box>
    );
  };
  
  export default Sidebar;