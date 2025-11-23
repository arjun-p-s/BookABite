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
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { LuClock, LuCalendar, LuUsers, LuUserCheck, LuArrowLeft, LuPlus, LuCheck } from "react-icons/lu";
  import AdminLayout from "../../components/admin/layout/AdminLayout";
  
  type TimeSlotForm = {
    date: string;
    startTime: string;
    endTime: string;
    totalSeats: number;
    maxPeoplePerBooking: number;
  };
  
  const CreateTimeSlotPage = () => {
    const navigate = useNavigate();
    const { restaurantId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState<TimeSlotForm>({
      date: "",
      startTime: "",
      endTime: "",
      totalSeats: 0,
      maxPeoplePerBooking: 0,
    });
  
    const handleInputChange = (field: keyof TimeSlotForm, value: string | number) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };
  
    const handleSubmit = async () => {
      if (!formData.date || !formData.startTime || !formData.endTime || 
          formData.totalSeats <= 0 || formData.maxPeoplePerBooking <= 0) {
        alert("Please fill in all required fields");
        return;
      }
  
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log("Time Slot Created:", { restaurantId, ...formData });
        
        // Show success message
        const successDiv = document.createElement("div");
        successDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 16px 24px;
          border-radius: 12px;
          z-index: 9999;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          background: #10b981;
          color: white;
        `;
        successDiv.textContent = "Time slot created successfully! ✓";
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          successDiv.remove();
          navigate("/admin/timeslots");
        }, 1500);
        
        setIsSubmitting(false);
      }, 1500);
    };
  
    const isFormValid = 
      formData.date && 
      formData.startTime && 
      formData.endTime && 
      formData.totalSeats > 0 && 
      formData.maxPeoplePerBooking > 0;
  
    const calculateDuration = () => {
      if (!formData.startTime || !formData.endTime) return null;
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return diff > 0 ? diff : null;
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
                Create New Time Slot
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} ml={10}>
              Set up availability and capacity for bookings
            </Text>
          </Box>
  
          {/* Main Form */}
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Date & Time Card */}
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
              <Flex
                direction={{ base: "column", sm: "row" }}
                gap={{ base: 4, sm: 6 }}
                mb={6}
              >
                <Flex align="center" gap={3}>
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
                      Date & Time
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      When is this slot available?
                    </Text>
                  </Box>
                </Flex>
              </Flex>
  
              <VStack spacing={5} align="stretch">
                {/* Date */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                    Date <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    size="lg"
                    min={new Date().toISOString().split('T')[0]}
                    borderRadius="xl"
                    borderColor="gray.300"
                    _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0ea5e9" }}
                    _hover={{ borderColor: "gray.400" }}
                  />
                </Box>
  
                {/* Time Range */}
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
  
                {/* Duration Display */}
                {calculateDuration() !== null && (
                  <Box
                    p={4}
                    bg="gradient-to-r from-cyan-50 to-teal-50"
                    borderRadius="xl"
                    border="1px"
                    borderColor="cyan.200"
                    style={{
                      animation: "scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <HStack>
                      <Badge colorScheme="cyan" fontSize="sm" px={3} py={1}>
                        Duration: {calculateDuration()} hours
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
                animation: "fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards",
              }}
            >
              <Flex
                direction={{ base: "column", sm: "row" }}
                gap={{ base: 4, sm: 6 }}
                mb={6}
              >
                <Flex align="center" gap={3}>
                  <Box
                    bg="linear-gradient(135deg, #14b8a6 0%, #10b981 100%)"
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
              </Flex>
  
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                <Box>
                  <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                    Total Seats <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Flex align="center" gap={2}>
                    <Box color="cyan.500">
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
                    Total available seats for this time slot
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                    Max Per Booking <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Flex align="center" gap={2}>
                    <Box color="teal.500">
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
                    Maximum people allowed per single booking
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
                    {formData.totalSeats || "-"}
                  </Text>
                  <Text fontSize="xs" color="gray.600" mt={1}>Total Seats</Text>
                </Box>
                <Box textAlign="center" p={4} bg="teal.50" borderRadius="xl">
                  <Text fontSize="2xl" fontWeight="700" color="teal.600">
                    {formData.maxPeoplePerBooking || "-"}
                  </Text>
                  <Text fontSize="xs" color="gray.600" mt={1}>Max/Booking</Text>
                </Box>
                <Box textAlign="center" p={4} bg="purple.50" borderRadius="xl">
                  <Text fontSize="2xl" fontWeight="700" color="purple.600">
                    {calculateDuration() || "-"}h
                  </Text>
                  <Text fontSize="xs" color="gray.600" mt={1}>Duration</Text>
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
              spacing={4}
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
                bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                color="white"
                _hover={{ 
                  bgGradient: "linear(to-r, #14b8a6, #10b981)",
                  transform: "translateY(-2px)",
                  boxShadow: "lg"
                }}
                onClick={handleSubmit}
                isDisabled={!isFormValid || isSubmitting}
                isLoading={isSubmitting}
                loadingText="Creating..."
                size="lg"
                borderRadius="xl"
                leftIcon={<LuPlus />}
                transition="all 0.3s"
              >
                Create Time Slot
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