import {
  Box,
  Button,
  Heading,
  HStack,
  VStack,
  Text,
  IconButton,
  SimpleGrid,
  Badge,
  Input,
  useDisclosure,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LuPlus, LuTrash2, LuClock, LuX, LuChevronDown, LuChevronUp } from "react-icons/lu";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { restaurantApi } from "../../api/adminApi";

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
};

type Restaurant = {
  _id: string;
  name: string;
  timeSlots?: TimeSlot[];
};

const TimeSlotsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [expandedRestaurantId, setExpandedRestaurantId] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({
    startTime: "",
    endTime: "",
    capacity: 0,
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await restaurantApi.getAll();
      
      // Mock time slots for demonstration
      const restaurantsWithSlots = data.map((restaurant: any) => ({
        ...restaurant,
        timeSlots: [
          { id: `${restaurant._id}-1`, startTime: "09:00", endTime: "11:00", capacity: 20, isActive: true },
          { id: `${restaurant._id}-2`, startTime: "11:00", endTime: "13:00", capacity: 30, isActive: true },
          { id: `${restaurant._id}-3`, startTime: "17:00", endTime: "19:00", capacity: 40, isActive: true },
          { id: `${restaurant._id}-4`, startTime: "19:00", endTime: "21:00", capacity: 50, isActive: true },
        ],
      }));
      
      setRestaurants(restaurantsWithSlots);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = () => {
    if (!selectedRestaurant || !newSlot.startTime || !newSlot.endTime || newSlot.capacity <= 0) {
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      capacity: newSlot.capacity,
      isActive: true,
    };

    setRestaurants(restaurants.map(r => 
      r._id === selectedRestaurant._id 
        ? { ...r, timeSlots: [...(r.timeSlots || []), slot] }
        : r
    ));

    setNewSlot({ startTime: "", endTime: "", capacity: 0 });
    onClose();
  };

  const handleDeleteSlot = (restaurantId: string, slotId: string) => {
    setRestaurants(restaurants.map(r => 
      r._id === restaurantId 
        ? { ...r, timeSlots: (r.timeSlots || []).filter(slot => slot.id !== slotId) }
        : r
    ));
  };

  const toggleSlotStatus = (restaurantId: string, slotId: string) => {
    setRestaurants(restaurants.map(r => 
      r._id === restaurantId 
        ? { 
            ...r, 
            timeSlots: (r.timeSlots || []).map(slot => 
              slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
            ) 
          }
        : r
    ));
  };

  const toggleExpand = (restaurantId: string) => {
    setExpandedRestaurantId(expandedRestaurantId === restaurantId ? null : restaurantId);
  };

  const openAddModal = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    onOpen();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Center minH="400px">
          <Box textAlign="center">
            <Spinner size="xl" color="cyan.500" thickness="4px" mb={4} />
            <Text color="gray.600">Loading restaurants...</Text>
          </Box>
        </Center>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box maxW="100%" overflow="hidden">
        <Heading size={{ base: "md", md: "lg" }} color="gray.800" mb={2}>
          Time Slots Management
        </Heading>
        <Text color="gray.600" mb={6} fontSize={{ base: "sm", md: "md" }}>
          Manage time slots for each restaurant individually
        </Text>

        <VStack spacing={4} align="stretch">
          {restaurants.map((restaurant, index) => {
            const isExpanded = expandedRestaurantId === restaurant._id;
            const totalSlots = restaurant.timeSlots?.length || 0;
            const activeSlots = restaurant.timeSlots?.filter(s => s.isActive).length || 0;

            return (
              <Box
                key={restaurant._id}
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                border="1px"
                borderColor="gray.200"
                overflow="hidden"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{ boxShadow: "md" }}
                style={{
                  animation: `slideIn 0.4s ease ${index * 0.1}s backwards`,
                }}
              >
                {/* Restaurant Header */}
                <Flex
                  p={{ base: 4, md: 6 }}
                  justify="space-between"
                  align="center"
                  cursor="pointer"
                  onClick={() => toggleExpand(restaurant._id)}
                  _hover={{ bg: "gray.50" }}
                  transition="background 0.2s"
                >
                  <Box flex="1">
                    <Heading size={{ base: "sm", md: "md" }} color="gray.800" mb={2}>
                      {restaurant.name}
                    </Heading>
                    <HStack spacing={3} flexWrap="wrap">
                      <Badge colorScheme="cyan" fontSize="xs">
                        {totalSlots} time slots
                      </Badge>
                      <Badge colorScheme="green" fontSize="xs">
                        {activeSlots} active
                      </Badge>
                    </HStack>
                  </Box>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      leftIcon={<LuPlus />}
                      bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                      color="white"
                      _hover={{ bgGradient: "linear(to-r, #14b8a6, #10b981)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddModal(restaurant);
                      }}
                      display={{ base: "none", sm: "flex" }}
                    >
                      Add Slot
                    </Button>
                    <IconButton
                      aria-label="Toggle"
                      size="sm"
                      variant="ghost"
                      transition="transform 0.3s"
                      transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
                    >
                      {isExpanded ? <LuChevronUp /> : <LuChevronDown />}
                    </IconButton>
                  </HStack>
                </Flex>

                {/* Time Slots Grid */}
                <Box
                  maxH={isExpanded ? "1000px" : "0"}
                  overflow="hidden"
                  transition="max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s"
                  opacity={isExpanded ? 1 : 0}
                >
                  <Box p={{ base: 4, md: 6 }} pt={0}>
                    <Button
                      size="sm"
                      leftIcon={<LuPlus />}
                      bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                      color="white"
                      _hover={{ bgGradient: "linear(to-r, #14b8a6, #10b981)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddModal(restaurant);
                      }}
                      mb={4}
                      width={{ base: "full", sm: "auto" }}
                      display={{ base: "flex", sm: "none" }}
                    >
                      Add Time Slot
                    </Button>

                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
                      {(restaurant.timeSlots || []).map((slot, slotIndex) => (
                        <Box
                          key={slot.id}
                          bg="gray.50"
                          p={4}
                          borderRadius="lg"
                          border="1px"
                          borderColor="gray.200"
                          transition="all 0.3s"
                          opacity={slot.isActive ? 1 : 0.6}
                          _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                          style={{
                            animation: `fadeIn 0.3s ease ${slotIndex * 0.05}s backwards`,
                          }}
                        >
                          <HStack justify="space-between" mb={3}>
                            <HStack spacing={2}>
                              <Box
                                bg="cyan.100"
                                p={2}
                                borderRadius="md"
                                color="cyan.600"
                              >
                                <LuClock size={16} />
                              </Box>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="700" fontSize="sm">
                                  {slot.startTime} - {slot.endTime}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {slot.capacity} seats
                                </Text>
                              </VStack>
                            </HStack>
                            <IconButton
                              aria-label="Delete slot"
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteSlot(restaurant._id, slot.id)}
                            >
                              <LuTrash2 size={14} />
                            </IconButton>
                          </HStack>

                          <HStack justify="space-between">
                            <Badge
                              colorScheme={slot.isActive ? "green" : "red"}
                              fontSize="xs"
                            >
                              {slot.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme={slot.isActive ? "red" : "green"}
                              onClick={() => toggleSlotStatus(restaurant._id, slot.id)}
                              fontSize="xs"
                            >
                              {slot.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </HStack>
                        </Box>
                      ))}
                    </SimpleGrid>

                    {(!restaurant.timeSlots || restaurant.timeSlots.length === 0) && (
                      <Box textAlign="center" py={8}>
                        <Text color="gray.500" fontSize="sm">
                          No time slots yet. Click "Add Slot" to create one.
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </VStack>

        {restaurants.length === 0 && (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">No restaurants found</Text>
          </Box>
        )}

        {/* Add Time Slot Modal */}
        {isOpen && (
          <>
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={1000}
              onClick={onClose}
              style={{
                animation: "fadeIn 0.2s ease",
              }}
            />
            
            <Box
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              borderRadius="xl"
              boxShadow="2xl"
              zIndex={1001}
              width={{ base: "90%", sm: "400px" }}
              maxW="500px"
              style={{
                animation: "scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <HStack justify="space-between" p={6} borderBottom="1px" borderColor="gray.200">
                <Box>
                  <Heading size="md">Add Time Slot</Heading>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {selectedRestaurant?.name}
                  </Text>
                </Box>
                <IconButton
                  aria-label="Close"
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                >
                  <LuX />
                </IconButton>
              </HStack>
              
              <Box p={6}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                      Start Time <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      size="md"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                      End Time <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      size="md"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                      Capacity (seats) <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      type="number"
                      value={newSlot.capacity || ""}
                      onChange={(e) => setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) || 0 })}
                      min={1}
                      placeholder="Enter number of seats"
                      size="md"
                    />
                  </Box>
                </VStack>
              </Box>
              
              <HStack justify="flex-end" p={6} borderTop="1px" borderColor="gray.200" gap={3}>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                  color="white"
                  onClick={handleAddSlot}
                  _hover={{ bgGradient: "linear(to-r, #14b8a6, #10b981)" }}
                  isDisabled={!newSlot.startTime || !newSlot.endTime || newSlot.capacity <= 0}
                >
                  Add Slot
                </Button>
              </HStack>
            </Box>

            <style>
              {`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes scaleIn {
                  from { 
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                  }
                  to { 
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                  }
                }
                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}
            </style>
          </>
        )}
      </Box>
    </AdminLayout>
  );
};

export default TimeSlotsPage;