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
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LuPlus, LuTrash2, LuClock, LuX, LuChevronDown, LuChevronUp, LuPencil, LuCalendar, LuCalendarDays } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { restaurantApi } from "../../api/adminApi";
import axios from "axios";

type TimeSlot = {
  _id: string;
  date: string;
  time: string;
  availableSeats: number;
  maxCapacity: number;
  maxPeoplePerBooking: number;
  isBlocked: boolean;
};

type Restaurant = {
  _id: string;
  name: string;
};

const TimeSlotsPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [expandedRestaurantId, setExpandedRestaurantId] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [viewMode, setViewMode] = useState<"today" | "week">("today");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [editForm, setEditForm] = useState({
    availableSeats: 0,
    isBlocked: false,
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await restaurantApi.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

 const fetchTimeSlots = async (restaurantId: string) => {
  try {
    const token = localStorage.getItem("token");
    
    let url = `http://localhost:3001/timeslots/list/${restaurantId}`;
    
    // For week view, calculate date range
    if (viewMode === "week") {
      const start = new Date(selectedDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      
      url += `/range?startDate=${startStr}&endDate=${endStr}`;
    } else {
      // Single day view
      url += `/${selectedDate}`;
    }

    console.log(`🔍 Fetching slots from: ${url}`);

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    console.log(`📊 Received ${response.data.timeSlots?.length || 0} slots`);
    
    setTimeSlots(response.data.timeSlots || []);

  } catch (error) {
    console.error("❌ Error fetching time slots:", error);
    setTimeSlots([]);
  }
};

  // Normalize date to YYYY-MM-DD using local date components to avoid timezone shifts
  const toDateKey = (dateStr: string) => {
    if (!dateStr) return ""; // Handle undefined safely
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return (dateStr || "").split("T")[0] || dateStr;
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  
  const toggleExpand = async (restaurant: Restaurant) => {
    if (expandedRestaurantId === restaurant._id) {
      setExpandedRestaurantId(null);
      setSelectedRestaurant(null);
      setTimeSlots([]);
    } else {
      setExpandedRestaurantId(restaurant._id);
      setSelectedRestaurant(restaurant);
      await fetchTimeSlots(restaurant._id);
    }
  };

  // Refetch when selectedDate changes for the currently expanded restaurant
  useEffect(() => {
    if (selectedRestaurant) {
      fetchTimeSlots(selectedRestaurant._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);
  
  const getFilteredSlots = () => {
    if (viewMode === "today") {
      return timeSlots.filter(slot => toDateKey(slot.date) === selectedDate);
    } else {
      // Week view - get next 7 days (compare date keys)
      const start = new Date(selectedDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const startKey = toDateKey(start.toISOString());
      const endKey = toDateKey(end.toISOString());

      return timeSlots.filter(slot => {
        const key = toDateKey(slot.date);
        return key >= startKey && key <= endKey;
      });
    }
  };
  
  const groupSlotsByDate = () => {
    const filtered = getFilteredSlots();
    const grouped: { [key: string]: TimeSlot[] } = {};
    
    filtered.forEach(slot => {
      const key = toDateKey(slot.date);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(slot);
    });
    
    // Sort slots within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time));
    });
    
    // Ensure grouped keys are in chronological order when iterating
    const ordered: { [key: string]: TimeSlot[] } = {};
    Object.keys(grouped)
      .sort((a, b) => (a > b ? 1 : -1))
      .forEach(k => (ordered[k] = grouped[k]));

    return ordered;
  };
  
  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure you want to delete this time slot?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/timeslots/delete/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      showAlert("Time slot deleted successfully", "success");
      if (selectedRestaurant) {
        await fetchTimeSlots(selectedRestaurant._id);
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
      showAlert("Failed to delete time slot", "error");
    }
  };

  const openEditModal = (slot: TimeSlot) => {
    console.log("Opening edit for:", slot); // Debug log
    setEditingSlot(slot);
    setEditForm({
      availableSeats: slot.availableSeats,
      isBlocked: slot.isBlocked,
    });
    setIsEditOpen(true);
  };

  // --- UPDATED FUNCTION START ---
 // Replace your handleUpdateSlot function with this:
const handleUpdateSlot = async () => {
  // 1. Validation and Debugging
  if (!editingSlot) {
    console.error("No editing slot found");
    return;
  }

  // FIX: Map frontend field names to backend field names
  const payload = {
    totalSeats: editForm.availableSeats,  // Backend expects 'totalSeats'
    isBlocked: Boolean(editForm.isBlocked) // Ensure it's a boolean
  };

  console.log("Sending Update Payload:", {
    id: editingSlot._id,
    data: payload
  });
  
  try {
    const token = localStorage.getItem("token");
    
    // 2. Added Content-Type header explicitly
    await axios.patch(
      `http://localhost:3001/timeslots/edit/${editingSlot._id}`,
      payload, // Using the mapped payload instead of editForm
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        withCredentials: true,
      },
    );
    
    console.log("Update successful");
    showAlert("Time slot updated successfully", "success");
    setIsEditOpen(false);
    
    // Refresh list
    if (selectedRestaurant) {
      await fetchTimeSlots(selectedRestaurant._id);
    }
  } catch (error: any) {
    // 3. Detailed Error Logging
    console.error("Error updating slot:", error);
    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
    }
    showAlert("Failed to update time slot", "error");
  }
};
  // --- UPDATED FUNCTION END ---

  const showAlert = (message: string, type: "success" | "error") => {
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 9999;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      ${type === "success" ? "background: #10b981; color: white;" : ""}
      ${type === "error" ? "background: #ef4444; color: white;" : ""}
    `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Center minH="400px">
          <Box textAlign="center">
            <Spinner size="xl" color="cyan.500"  mb={4} />
            <Text color="gray.600">Loading restaurants...</Text>
          </Box>
        </Center>
      </AdminLayout>
    );
  }

  const groupedSlots = groupSlotsByDate();

  return (
    <AdminLayout>
      <Box maxW="100%" overflow="hidden">
        <Heading size={{ base: "md", md: "lg" }} color="gray.800" mb={2}>
          Time Slots Management
        </Heading>
        <Text color="gray.600" mb={6} fontSize={{ base: "sm", md: "md" }}>
          Manage time slots for each restaurant
        </Text>

        <VStack gap={4} align="stretch">
          {restaurants.map((restaurant, index) => {
            const isExpanded = expandedRestaurantId === restaurant._id;
            const restaurantSlots = timeSlots.filter(s => !s.isBlocked);

            return (
              <Box
                key={restaurant._id}
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                border="1px"
                borderColor="gray.200"
                overflow="hidden"
                transition="all 0.3s"
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
                  onClick={() => toggleExpand(restaurant)}
                  _hover={{ bg: "gray.50" }}
                  transition="background 0.2s"
                >
                  <Box flex="1">
                    <Heading size={{ base: "sm", md: "md" }} color="gray.800" mb={2}>
                      {restaurant.name}
                    </Heading>
                    <HStack gap={3} flexWrap="wrap">
                      <Badge colorPalette="cyan" fontSize="xs">
                        {timeSlots.length} total slots
                      </Badge>
                      <Badge colorPalette="green" fontSize="xs">
                        {restaurantSlots.length} available
                      </Badge>
                    </HStack>
                  </Box>
                  <HStack gap={2}>
                    <Button
                      size="sm"
                      gap={2}
                      bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                      color="white"
                      _hover={{ bgGradient: "linear(to-r, #14b8a6, #10b981)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/timeslots/create/${restaurant._id}`);
                      }}
                      display={{ base: "none", sm: "flex" }}
                    >
                      <LuPlus /> Create Slots
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

                {/* Time Slots Content */}
                <Box
                  maxH={isExpanded ? "2000px" : "0"}
                  overflow="hidden"
                  transition="max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                  opacity={isExpanded ? 1 : 0}
                >
                  <Box p={{ base: 4, md: 6 }} pt={0} borderTop="1px" borderColor="gray.100">
                    {/* Mobile Create Button */}
                    <Button
                      size="sm"
                      gap={2}
                      bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                      color="white"
                      _hover={{ bgGradient: "linear(to-r, #14b8a6, #10b981)" }}
                      onClick={() => navigate(`/admin/timeslots/create/${restaurant._id}`)}
                      mb={4}
                      width={{ base: "full", sm: "auto" }}
                      display={{ base: "flex", sm: "none" }}
                    >
                      <LuPlus /> Create Time Slots
                    </Button>

                    {/* View Toggle */}
                    <Flex justify="space-between" align="center" mb={4} gap={4} flexWrap="wrap">
                      <HStack gap={2}>
                        <Button
                          size="sm"
                          gap={2}
                          colorPalette={viewMode === "today" ? "cyan" : "gray"}
                          variant={viewMode === "today" ? "solid" : "outline"}
                          onClick={() => setViewMode("today")}
                        >
                          <LuCalendar /> Today
                        </Button>
                        <Button
                          size="sm"
                          gap={2}
                          colorPalette={viewMode === "week" ? "cyan" : "gray"}
                          variant={viewMode === "week" ? "solid" : "outline"}
                          onClick={() => setViewMode("week")}
                        >
                          <LuCalendarDays /> Week
                        </Button>
                      </HStack>
                      
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        size="sm"
                        width="auto"
                        maxW="200px"
                      />
                    </Flex>

                    {/* Slots Display */}
                    {Object.keys(groupedSlots).length === 0 ? (
                      <Box textAlign="center" py={8} bg="gray.50" borderRadius="lg">
                        <Text color="gray.500" fontSize="sm">
                          No time slots found for selected {viewMode === "today" ? "date" : "week"}
                        </Text>
                        <Button
                          size="sm"
                          mt={3}
                          gap={2}
                          colorPalette="cyan"
                          variant="ghost"
                          onClick={() => navigate(`/admin/timeslots/create/${restaurant._id}`)}
                        >
                          <LuPlus /> Create Time Slots
                        </Button>
                      </Box>
                    ) : (
                      <VStack gap={6} align="stretch">
                        {Object.entries(groupedSlots).map(([date, slots]) => (
                          <Box key={date}>
                            <Text fontWeight="700" fontSize="md" mb={3} color="gray.700">
                              {formatDate(date)}
                            </Text>
                            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={3}>
                              {slots.map((slot) => (
                                <Box
                                  key={slot._id}
                                  bg={slot.isBlocked ? "red.50" : "gray.50"}
                                  p={4}
                                  borderRadius="lg"
                                  border="1px"
                                  borderColor={slot.isBlocked ? "red.200" : "gray.200"}
                                  transition="all 0.3s"
                                  _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                                >
                                  <HStack justify="space-between" mb={3}>
                                    <HStack gap={2}>
                                      <Box
                                        bg={slot.isBlocked ? "red.100" : "cyan.100"}
                                        p={2}
                                        borderRadius="md"
                                        color={slot.isBlocked ? "red.600" : "cyan.600"}
                                      >
                                        <LuClock size={16} />
                                      </Box>
                                      <VStack align="start" gap={0}>
                                        <Text fontWeight="700" fontSize="sm">
                                          {formatTime(slot.time)}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                          {slot.availableSeats}/{slot.maxCapacity} seats
                                        </Text>
                                      </VStack>
                                    </HStack>
                                    <HStack gap={1}>
                                      <IconButton
                                        aria-label="Edit slot"
                                        size="xs"
                                        variant="ghost"
                                        colorPalette="blue"
                                        onClick={() => openEditModal(slot)}
                                      >
                                        <LuPencil size={14} />
                                      </IconButton>
                                      <IconButton
                                        aria-label="Delete slot"
                                        size="xs"
                                        variant="ghost"
                                        colorPalette="red"
                                        onClick={() => handleDeleteSlot(slot._id)}
                                      >
                                        <LuTrash2 size={14} />
                                      </IconButton>
                                    </HStack>
                                  </HStack>

                                  <Badge
                                    colorPalette={slot.isBlocked ? "red" : "green"}
                                    fontSize="xs"
                                    w="full"
                                    textAlign="center"
                                    py={1}
                                  >
                                    {slot.isBlocked ? "Blocked" : "Available"}
                                  </Badge>
                                </Box>
                              ))}
                            </SimpleGrid>
                          </Box>
                        ))}
                      </VStack>
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

        {/* Edit Modal */}
        {isEditOpen && editingSlot && (
          <>
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={1000}
              onClick={() => setIsEditOpen(false)}
              style={{ animation: "fadeIn 0.2s ease" }}
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
              style={{ animation: "scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              <HStack justify="space-between" p={6} borderBottom="1px" borderColor="gray.200">
                <Box>
                  <Heading size="md">Edit Time Slot</Heading>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {formatDate(editingSlot.date)} at {formatTime(editingSlot.time)}
                  </Text>
                </Box>
                <IconButton
                  aria-label="Close"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditOpen(false)}
                >
                  <LuX />
                </IconButton>
              </HStack>
              
              <Box p={6}>
                <VStack gap={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                      Available Seats
                    </Text>
                    <Input
                      type="number"
                      value={editForm.availableSeats}
                      onChange={(e) => setEditForm({ ...editForm, availableSeats: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={editingSlot.maxCapacity}
                      size="md"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Max capacity: {editingSlot.maxCapacity}
                    </Text>
                  </Box>
                  
                  <Box>
                    <HStack justify="space-between">
                      <Text fontSize="sm" fontWeight="600" color="gray.700">
                        Block this time slot
                      </Text>
                      <Box
                        as="button"
                        onClick={() => setEditForm({ ...editForm, isBlocked: !editForm.isBlocked })}
                        px={3}
                        py={1}
                        borderRadius="md"
                        bg={editForm.isBlocked ? "red.500" : "gray.200"}
                        color={editForm.isBlocked ? "white" : "gray.600"}
                        fontSize="sm"
                        fontWeight="600"
                        transition="all 0.2s"
                        _hover={{ opacity: 0.8 }}
                      >
                        {editForm.isBlocked ? "Blocked" : "Active"}
                      </Box>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      Blocked slots cannot be booked by customers
                    </Text>
                  </Box>
                </VStack>
              </Box>
              
              <HStack justify="flex-end" p={6} borderTop="1px" borderColor="gray.200" gap={3}>
                <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button
                  bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                  color="white"
                  onClick={handleUpdateSlot}
                  type="button" // EXPLICIT TYPE
                  _hover={{ bgGradient: "linear(to-r, #14b8a6, #10b981)" }}
                >
                  Update Slot
                </Button>
              </HStack>
            </Box>
          </>
        )}

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
      </Box>
    </AdminLayout>
  );
};

export default TimeSlotsPage;