import {
  Box,
  Button,
  Heading,
  HStack,
  Badge,
  IconButton,
  Spinner,
  Center,
  Text,
  useDisclosure,
  Flex,
  VStack,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LuPlus, LuPencil, LuTrash2, LuEye, LuX, LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { restaurantApi } from "../../api/adminApi";

type Restaurant = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cuisineType: string[];
  address: {
    city: string;
    state: string;
  };
  totalCapacity: number;
  accountStatus: string;
  isVerified: boolean;
};

const RestaurantsListPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = restaurants.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisineType?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchQuery, restaurants]);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await restaurantApi.getAll();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await restaurantApi.delete(deleteId);
      setRestaurants(restaurants.filter(r => r._id !== deleteId));
      
      // Success notification
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
      successDiv.textContent = "Restaurant deleted successfully! ✓";
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
      
      onClose();
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("Failed to delete restaurant");
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    onOpen();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Center minH="400px">
          <Box textAlign="center">
            <Spinner size="xl" color="cyan.500" mb={4} />
            <Text color="gray.600">Loading restaurants...</Text>
          </Box>
        </Center>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box maxW="100%" overflow="hidden">
        {/* Header */}
        <Box
          mb={6}
          style={{
            animation: "fadeSlideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            gap={4}
          >
            <Box>
              <Heading size={{ base: "md", md: "lg" }} color="gray.800">
                Restaurants Management
              </Heading>
              <Text color="gray.600" fontSize="sm" mt={1}>
                {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""} found
              </Text>
            </Box>
            <Button
              gap={2}
              bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
              color="white"
              _hover={{ 
                bgGradient: "linear(to-r, #14b8a6, #10b981)",
                transform: "translateY(-2px)",
                boxShadow: "lg"
              }}
              onClick={() => navigate("/register-restaurant")}
              size={{ base: "md", md: "lg" }}
              borderRadius="xl"
              transition="all 0.3s"
            >
              <LuPlus /> Add Restaurant
            </Button>
          </Flex>
        </Box>

        {/* Search Bar */}
        <Box
          mb={6}
          style={{
            animation: "fadeSlideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards",
          }}
        >
          <Flex
            align="center"
            gap={3}
            bg="white"
            p={3}
            borderRadius="xl"
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
            _focusWithin={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0ea5e9" }}
            transition="all 0.3s"
          >
            <Box color="gray.400">
              <LuSearch size={20} />
            </Box>
            <Input
              placeholder="Search by name, location, or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              border="none"
              _focus={{ boxShadow: "none" }}
              fontSize="sm"
            />
          </Flex>
        </Box>

        {/* Restaurant Cards Grid */}
        <VStack gap={4} align="stretch">
          {filteredRestaurants.map((restaurant, index) => (
            <Box
              key={restaurant._id}
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              overflow="hidden"
              transition="all 0.3s"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              style={{
                animation: `fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s backwards`,
              }}
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                p={{ base: 4, md: 6 }}
                gap={{ base: 4, md: 6 }}
                align={{ base: "stretch", md: "center" }}
              >
                {/* Restaurant Info */}
                <Box flex="1" minW="0">
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    gap={3}
                    mb={3}
                    align={{ base: "start", sm: "center" }}
                  >
                    <Heading size="md" color="gray.800" lineClamp={1}>
                      {restaurant.name}
                    </Heading>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge
                        colorPalette={
                          restaurant.accountStatus === "active"
                            ? "green"
                            : restaurant.accountStatus === "pending"
                            ? "yellow"
                            : "red"
                        }
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {restaurant.accountStatus || "pending"}
                      </Badge>
                      {restaurant.isVerified && (
                        <Badge colorPalette="blue" fontSize="xs" px={2} py={1} borderRadius="md">
                          Verified
                        </Badge>
                      )}
                    </HStack>
                  </Flex>

                  <VStack align="start" gap={2} fontSize="sm" color="gray.600">
                    <HStack gap={4} flexWrap="wrap">
                      <Text>
                        📍 {restaurant.address?.city || "N/A"}
                      </Text>
                      <Text>
                        🍽️ {restaurant.cuisineType?.[0] || "N/A"}
                      </Text>
                      <Text>
                        👥 {restaurant.totalCapacity || 0} seats
                      </Text>
                    </HStack>
                    <HStack gap={4} flexWrap="wrap">
                      <Text>
                        📧 {restaurant.email}
                      </Text>
                      <Text>
                        📞 {restaurant.phone}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Action Buttons */}
                <HStack
                  gap={2}
                  justify={{ base: "flex-end", md: "center" }}
                  flexShrink={0}
                >
                  <IconButton
                    aria-label="View"
                    size="md"
                    variant="ghost"
                    colorPalette="blue"
                    onClick={() => navigate(`/booking`)}
                    borderRadius="lg"
                    _hover={{ bg: "blue.50" }}
                  >
                    <LuEye size={18} />
                  </IconButton>
                  <IconButton
                    aria-label="Edit"
                    size="md"
                    variant="ghost"
                    colorPalette="cyan"
                    onClick={() => navigate(`/admin/restaurants/edit/${restaurant._id}`)}
                    borderRadius="lg"
                    _hover={{ bg: "cyan.50" }}
                  >
                    <LuPencil size={18} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    size="md"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => openDeleteModal(restaurant._id)}
                    borderRadius="lg"
                    _hover={{ bg: "red.50" }}
                  >
                    <LuTrash2 size={18} />
                  </IconButton>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>

        {filteredRestaurants.length === 0 && !isLoading && (
          <Center py={16}>
            <VStack gap={4}>
              <Text fontSize="4xl">🔍</Text>
              <Text color="gray.500" fontSize="lg">
                {searchQuery ? "No restaurants found matching your search" : "No restaurants yet"}
              </Text>
              {!searchQuery && (
                <Button
                  onClick={() => navigate("/register-restaurant")}
                  bgGradient="linear(to-r, #0ea5e9, #14b8a6)"
                  color="white"
                  _hover={{ bgGradient: "linear(to-r, #14b8a6, #10b981)" }}
                >
                  Add First Restaurant
                </Button>
              )}
            </VStack>
          </Center>
        )}

        {/* Delete Confirmation Modal */}
        {open && (
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
                <Heading size="md">Confirm Delete</Heading>
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
                <Text>
                  Are you sure you want to delete this restaurant? This action cannot be undone and will remove all associated data.
                </Text>
              </Box>
              
              <HStack justify="flex-end" p={6} borderTop="1px" borderColor="gray.200" gap={3}>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  colorPalette="red" 
                  onClick={handleDelete}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.3s"
                >
                  Delete
                </Button>
              </HStack>
            </Box>
          </>
        )}

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
          `}
        </style>
      </Box>
    </AdminLayout>
  );
};

export default RestaurantsListPage;