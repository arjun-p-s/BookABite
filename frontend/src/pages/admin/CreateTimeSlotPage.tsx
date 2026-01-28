import {
    Box,
    Button,
    Heading,
    VStack,
    Text,
    Input,
    HStack,
    SimpleGrid,
    Badge,
    Flex,
    IconButton,
    Stack,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { LuClock, LuCalendar, LuUsers, LuUserCheck, LuArrowLeft, LuPlus, LuCheck } from "react-icons/lu";
  import AdminLayout from "../../components/admin/layout/AdminLayout";
  import axios from "axios";
  
  type TimeSlotForm = {
    startDate: string;
    endDate: string;
    durationType: "single" | "range" | "week";
    selectedDays: string[]; // For week selection
    startTime: string;
    endTime: string;
    slotInterval: number; // in minutes (30, 60, etc.)
    totalSeats: number;
    maxPeoplePerBooking: number;
  };
  
  const daysOfWeek = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];
  
  const CreateTimeSlotPage = () => {
    const navigate = useNavigate();
    const { restaurantId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState<TimeSlotForm>({
      startDate: "",
      endDate: "",
      durationType: "single",
      selectedDays: [],
      startTime: "",
      endTime: "",
      slotInterval: 30,
      totalSeats: 0,
      maxPeoplePerBooking: 0,
    });
  
    const handleInputChange = (field: keyof TimeSlotForm, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };
  
    const handleDayToggle = (day: string) => {
      setFormData(prev => ({
        ...prev,
        selectedDays: prev.selectedDays.includes(day)
          ? prev.selectedDays.filter(d => d !== day)
          : [...prev.selectedDays, day]
      }));
    };
  
    const selectAllDays = () => {
      setFormData(prev => ({
        ...prev,
        selectedDays: daysOfWeek.map(d => d.value)
      }));
    };
  
    const clearAllDays = () => {
      setFormData(prev => ({
        ...prev,
        selectedDays: []
      }));
    };
  
    // Auto-calculate end date for week duration
    const handleDurationTypeChange = (type: "single" | "range" | "week") => {
      setFormData(prev => {
        if (type === "week" && prev.startDate) {
          const start = new Date(prev.startDate);
          const end = new Date(start);
          end.setDate(end.getDate() + 6); // 7 days total
          return {
            ...prev,
            durationType: type,
            endDate: end.toISOString().split('T')[0]
          };
        }
        return { ...prev, durationType: type };
      });
    };
  
    const calculateTotalSlots = () => {
      if (!formData.startTime || !formData.endTime) return 0;
      
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      
      if (diffMinutes <= 0) return 0;
      
      const slotsPerDay = Math.floor(diffMinutes / formData.slotInterval);
      
      if (formData.durationType === "single") {
        return slotsPerDay;
      } else if (formData.durationType === "week") {
        return slotsPerDay * formData.selectedDays.length;
      } else if (formData.durationType === "range" && formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return slotsPerDay * days;
      }
      
      return 0;
    };
  
    const showAlert = (message: string, type: "success" | "error" | "warning") => {
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
        max-width: 400px;
        ${type === "success" ? "background: #10b981; color: white;" : ""}
        ${type === "error" ? "background: #ef4444; color: white;" : ""}
        ${type === "warning" ? "background: #f59e0b; color: white;" : ""}
      `;
      alertDiv.textContent = message;
      document.body.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);
    };
  
    const handleSubmit = async () => {
      if (!restaurantId) {
        showAlert("Restaurant ID is missing", "error");
        return;
      }
  
      if (!formData.startDate || !formData.startTime || !formData.endTime || 
          formData.totalSeats <= 0 || formData.maxPeoplePerBooking <= 0) {
        showAlert("Please fill in all required fields", "warning");
        return;
      }
  
      if (formData.durationType === "week" && formData.selectedDays.length === 0) {
        showAlert("Please select at least one day of the week", "warning");
        return;
      }
  
      if (formData.durationType === "range" && !formData.endDate) {
        showAlert("Please select an end date for date range", "warning");
        return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("Please login first", "error");
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        const payload = {
          restaurantId,
          startDate: formData.startDate,
          endDate: formData.durationType === "single" ? formData.startDate : formData.endDate,
          durationType: formData.durationType,
          selectedDays: formData.durationType === "week" ? formData.selectedDays : [],
          startTime: formData.startTime,
          endTime: formData.endTime,
          slotInterval: formData.slotInterval,
          totalSeats: formData.totalSeats,
          maxPeoplePerBooking: formData.maxPeoplePerBooking,
        };
  
        await axios.post("http://localhost:3001/timeslots/add", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
  
        showAlert("Time slots created successfully! ✓", "success");
        
        setTimeout(() => {
          navigate("/admin/timeslots");
        }, 1500);
  
      } catch (error: any) {
        console.error(error);
        showAlert(
          error.response?.data?.message || "Failed to create time slots. Please try again.",
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const isFormValid = 
      formData.startDate && 
      formData.startTime && 
      formData.endTime && 
      formData.totalSeats > 0 && 
      formData.maxPeoplePerBooking > 0 &&
      (formData.durationType !== "week" || formData.selectedDays.length > 0) &&
      (formData.durationType !== "range" || formData.endDate);
  
    const calculateDuration = () => {
      if (!formData.startTime || !formData.endTime) return null;
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return diff > 0 ? diff.toFixed(1) : null;
    };
  
    return (
      <AdminLayout>
        <Box maxW="900px" mx="auto" px={{ base: 4, md: 0 }}>
          {/* Header */}
          <Box
            mb={{ base: 6, md: 8 }}
            style={{
              animation: "fadeSlideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <HStack mb={2}>
              <IconButton
                aria-label="Back"
                size="sm"
                variant="ghost"
                onClick={() => navigate("/admin/timeslots")}
                _hover={{ bg: "gray.100" }}
              >
                <LuArrowLeft />
              </IconButton>
              <Heading size={{ base: "lg", md: "xl" }} color="gray.800">
                Create Time Slots
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} ml={10}>
              Set up availability and capacity for bookings
            </Text>
          </Box>
  
          <VStack gap={{ base: 4, md: 6 }} align="stretch">
            {/* Duration Type Selection */}
            <Box
              bg="white"
              p={{ base: 5, md: 6 }}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              transition="all 0.3s"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              style={{
                animation: "fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards",
              }}
            >
              <Text fontSize="sm" fontWeight="600" mb={3} color="gray.700">
                Duration Type <Text as="span" color="red.500">*</Text>
              </Text>
              <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
                <Button
                  variant={formData.durationType === "single" ? "solid" : "outline"}
                  colorPalette={formData.durationType === "single" ? "cyan" : "gray"}
                  onClick={() => handleDurationTypeChange("single")}
                  size="lg"
                  borderRadius="xl"
                >
                  Single Day
                </Button>
                <Button
                  variant={formData.durationType === "week" ? "solid" : "outline"}
                  colorPalette={formData.durationType === "week" ? "cyan" : "gray"}
                  onClick={() => handleDurationTypeChange("week")}
                  size="lg"
                  borderRadius="xl"
                >
                  Weekly
                </Button>
                <Button
                  variant={formData.durationType === "range" ? "solid" : "outline"}
                  colorPalette={formData.durationType === "range" ? "cyan" : "gray"}
                  onClick={() => handleDurationTypeChange("range")}
                  size="lg"
                  borderRadius="xl"
                >
                  Date Range
                </Button>
              </SimpleGrid>
            </Box>
  
            {/* Date Selection Card */}
            <Box
              bg="white"
              p={{ base: 5, md: 6 }}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              transition="all 0.3s"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              style={{
                animation: "fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.15s backwards",
              }}
            >
              <Flex align="center" gap={3} mb={6}>
                <Box
                  bg="linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)"
                  p={3}
                  borderRadius="xl"
                  color="white"
                >
                  <LuCalendar size={24} />
                </Box>
                <Box>
                  <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                    Date Selection
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {formData.durationType === "single" && "Select a single date"}
                    {formData.durationType === "week" && "Select start date and days"}
                    {formData.durationType === "range" && "Select date range"}
                  </Text>
                </Box>
              </Flex>
  
              <VStack gap={5} align="stretch">
                <SimpleGrid columns={{ base: 1, sm: formData.durationType === "range" ? 2 : 1 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                      {formData.durationType === "range" ? "Start Date" : "Date"} <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        handleInputChange("startDate", e.target.value);
                        if (formData.durationType === "week") {
                          const start = new Date(e.target.value);
                          const end = new Date(start);
                          end.setDate(end.getDate() + 6);
                          handleInputChange("endDate", end.toISOString().split('T')[0]);
                        }
                      }}
                      size="lg"
                      min={new Date().toISOString().split('T')[0]}
                      borderRadius="xl"
                      borderColor="gray.300"
                      _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0ea5e9" }}
                      _hover={{ borderColor: "gray.400" }}
                    />
                  </Box>
  
                  {formData.durationType === "range" && (
                    <Box>
                      <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                        End Date <Text as="span" color="red.500">*</Text>
                      </Text>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        size="lg"
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        borderRadius="xl"
                        borderColor="gray.300"
                        _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0ea5e9" }}
                        _hover={{ borderColor: "gray.400" }}
                      />
                    </Box>
                  )}
                </SimpleGrid>
  
                {/* Week Days Selection */}
                {formData.durationType === "week" && (
                  <Box
                    p={4}
                    bg="cyan.50"
                    borderRadius="xl"
                    border="1px"
                    borderColor="cyan.200"
                  >
                    <Flex justify="space-between" align="center" mb={3}>
                      <Text fontSize="sm" fontWeight="600" color="gray.700">
                        Select Days <Text as="span" color="red.500">*</Text>
                      </Text>
                      <HStack gap={2}>
                        <Button size="xs" variant="ghost" onClick={selectAllDays} colorPalette="cyan">
                          Select All
                        </Button>
                        <Button size="xs" variant="ghost" onClick={clearAllDays}>
                          Clear
                        </Button>
                      </HStack>
                    </Flex>
                    <Stack gap={2}>
                      {daysOfWeek.map((day) => {
                        const isSelected = formData.selectedDays.includes(day.value);
                        return (
                          <Box
                            key={day.value}
                            as="button"
                            onClick={() => handleDayToggle(day.value)}
                            display="flex"
                            alignItems="center"
                            gap={3}
                            p={3}
                            borderRadius="lg"
                            bg={isSelected ? "cyan.100" : "white"}
                            border="2px"
                            borderColor={isSelected ? "cyan.500" : "gray.200"}
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{
                              borderColor: "cyan.400",
                              bg: isSelected ? "cyan.200" : "gray.50"
                            }}
                          >
                            <Box
                              w="20px"
                              h="20px"
                              borderRadius="md"
                              bg={isSelected ? "cyan.500" : "white"}
                              border="2px"
                              borderColor={isSelected ? "cyan.500" : "gray.300"}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              transition="all 0.2s"
                            >
                              {isSelected && (
                                <Box color="white" fontSize="xs">
                                  <LuCheck size={14} />
                                </Box>
                              )}
                            </Box>
                            <Text fontSize="sm" fontWeight={isSelected ? "600" : "500"} color="gray.700">
                              {day.label}
                            </Text>
                          </Box>
                        );
                      })}
                    </Stack>
                    {formData.selectedDays.length > 0 && (
                      <Text fontSize="xs" color="cyan.700" mt={3} fontWeight="600">
                        ✓ {formData.selectedDays.length} day(s) selected
                      </Text>
                    )}
                  </Box>
                )}
  
                {formData.durationType === "week" && formData.startDate && formData.endDate && (
                  <Box
                    p={4}
                    bg="gradient-to-r from-cyan-50 to-teal-50"
                    borderRadius="xl"
                    border="1px"
                    borderColor="cyan.200"
                  >
                    <HStack>
                      <Badge colorPalette="cyan" fontSize="sm" px={3} py={1}>
                        Week: {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                      </Badge>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
  
            {/* Time Settings Card */}
            <Box
              bg="white"
              p={{ base: 5, md: 6 }}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              transition="all 0.3s"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              style={{
                animation: "fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards",
              }}
            >
              <Flex align="center" gap={3} mb={6}>
                <Box
                  bg="linear-gradient(135deg, #14b8a6 0%, #10b981 100%)"
                  p={3}
                  borderRadius="xl"
                  color="white"
                >
                  <LuClock size={24} />
                </Box>
                <Box>
                  <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                    Time Settings
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Define operating hours and intervals
                  </Text>
                </Box>
              </Flex>
  
              <VStack gap={5} align="stretch">
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                      Start Time <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Flex align="center" gap={2}>
                      <Box color="cyan.500">
                        <LuClock size={20} />
                      </Box>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        size="lg"
                        borderRadius="xl"
                        borderColor="gray.300"
                        _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0ea5e9" }}
                        _hover={{ borderColor: "gray.400" }}
                      />
                    </Flex>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                      End Time <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Flex align="center" gap={2}>
                      <Box color="teal.500">
                        <LuClock size={20} />
                      </Box>
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                        size="lg"
                        borderRadius="xl"
                        borderColor="gray.300"
                        _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0ea5e9" }}
                        _hover={{ borderColor: "gray.400" }}
                      />
                    </Flex>
                  </Box>
                </SimpleGrid>
  
                <Box>
                  <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                    Slot Interval <Text as="span" color="red.500">*</Text>
                  </Text>
                  <select
                    value={formData.slotInterval}
                    onChange={(e) => handleInputChange("slotInterval", parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      height: "48px",
                      padding: "0 1rem",
                      borderRadius: "0.75rem",
                      border: "1px solid #D1D5DB",
                      background: "white",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0ea5e9";
                      e.target.style.boxShadow = "0 0 0 1px #0ea5e9";
                      e.target.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D1D5DB";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Time between each booking slot
                  </Text>
                </Box>
  
                {calculateDuration() !== null && (
                  <Box
                    p={4}
                    bg="gradient-to-r from-cyan-50 to-teal-50"
                    borderRadius="xl"
                    border="1px"
                    borderColor="cyan.200"
                  >
                    <HStack>
                      <Badge colorPalette="cyan" fontSize="sm" px={3} py={1}>
                        Daily Duration: {calculateDuration()} hours
                      </Badge>
                      <Badge colorPalette="teal" fontSize="sm" px={3} py={1}>
                        Slots per day: {Math.floor((parseFloat(calculateDuration() || "0") * 60) / formData.slotInterval)}
                      </Badge>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
  
            {/* Capacity Card */}
            <Box
              bg="white"
              p={{ base: 5, md: 6 }}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              transition="all 0.3s"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              style={{
                animation: "fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.25s backwards",
              }}
            >
              <Flex align="center" gap={3} mb={6}>
                <Box
                  bg="linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                  p={3}
                  borderRadius="xl"
                  color="white"
                >
                  <LuUsers size={24} />
                </Box>
                <Box>
                  <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                    Capacity Settings
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Define seating and booking limits
                  </Text>
                </Box>
              </Flex>
  
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                <Box>
                  <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                    Total Seats per Slot <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Flex align="center" gap={2}>
                    <Box color="purple.500">
                      <LuUserCheck size={20} />
                    </Box>
                    <Input
                      type="number"
                      value={formData.totalSeats || ""}
                      onChange={(e) => handleInputChange("totalSeats", parseInt(e.target.value) || 0)}
                      placeholder="e.g., 50"
                      size="lg"
                      min={1}
                      borderRadius="xl"
                      borderColor="gray.300"
                      _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0ea5e9" }}
                      _hover={{ borderColor: "gray.400" }}
                    />
                  </Flex>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Available seats for each time slot
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                    Max Per Booking <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Flex align="center" gap={2}>
                    <Box color="pink.500">
                      <LuUsers size={20} />
                    </Box>
                    <Input
                      type="number"
                      value={formData.maxPeoplePerBooking || ""}
                      onChange={(e) => handleInputChange("maxPeoplePerBooking", parseInt(e.target.value) || 0)}
                      placeholder="e.g., 10"
                      size="lg"
                      min={1}
                      borderRadius="xl"
                      borderColor="gray.300"
                      _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0ea5e9" }}
                      _hover={{ borderColor: "gray.400" }}
                    />
                  </Flex>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Maximum people per single booking
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
  
            {/* Summary Card */}
            <Box
              bg="white"
              p={{ base: 5, md: 6 }}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              style={{
                animation: "fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s backwards",
              }}
            >
              <Heading size="sm" mb={4} color="gray.800">
                Summary
              </Heading>
              <SimpleGrid columns={{ base: 2, sm: 4 }} gap={4}>
                <Box textAlign="center" p={4} bg="cyan.50" borderRadius="xl">
                  <Text fontSize="2xl" fontWeight="700" color="cyan.600">
                    {calculateTotalSlots() || "-"}
                  </Text>
                  <Text fontSize="xs" color="gray.600" mt={1}>Total Slots</Text>
                </Box>
                <Box textAlign="center" p={4} bg="teal.50" borderRadius="xl">
                  <Text fontSize="2xl" fontWeight="700" color="teal.600">
                    {formData.totalSeats || "-"}
                  </Text>
                  <Text fontSize="xs" color="gray.600" mt={1}>Seats/Slot</Text>
                </Box>
                <Box textAlign="center" p={4} bg="purple.50" borderRadius="xl">
                  <Text fontSize="2xl" fontWeight="700" color="purple.600">
                    {formData.slotInterval || "-"}m
                  </Text>
                  <Text fontSize="xs" color="gray.600" mt={1}>Interval</Text>
                </Box>
                <Box textAlign="center" p={4} bg={isFormValid ? "green.50" : "yellow.50"} borderRadius="xl">
                  <Box fontSize="2xl" color={isFormValid ? "green.600" : "yellow.600"}>
                    {isFormValid ? <LuCheck size={28} style={{ margin: "0 auto" }} /> : "!"}
                  </Box>
                  <Text fontSize="xs" color="gray.600" mt={1}>
                    {isFormValid ? "Ready" : "Incomplete"}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
  
            {/* Action Buttons */}
            <HStack
              gap={4}
              pt={4}
              style={{
                animation: "fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s backwards",
              }}
            >
              <Button
                flex="1"
                variant="outline"
                onClick={() => navigate("/admin/timeslots")}
                size="lg"
                borderRadius="xl"
                borderWidth="2px"
                _hover={{ bg: "gray.50" }}
              >
                Cancel
              </Button>
              <Button
                flex="1"
                gap={2}
                bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                color="white"
                _hover={{ 
                  bgGradient: "linear(to-r, #14b8a6, #10b981)",
                  transform: "translateY(-2px)",
                  boxShadow: "lg"
                }}
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                loading={isSubmitting}
                loadingText="Creating..."
                size="lg"
                borderRadius="xl"
                transition="all 0.3s"
              >
                <LuPlus /> Create Time Slots
              </Button>
            </HStack>
          </VStack>
  
          <style>
            {`
              @keyframes fadeSlideDown {
                from {
                  opacity: 0;
                  transform: translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes fadeSlideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}
          </style>
        </Box>
      </AdminLayout>
    );
  };
  
  export default CreateTimeSlotPage;