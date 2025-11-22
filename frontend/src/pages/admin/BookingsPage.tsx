import {
  Box,
  Heading,
  Badge,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { dummyBookings, type Booking } from "../../data/dummyBooking";

const BookingsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredBookings = statusFilter === "all" 
    ? dummyBookings 
    : dummyBookings.filter(b => b.status === statusFilter);

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed": return "green";
      case "pending": return "yellow";
      case "cancelled": return "red";
      case "completed": return "blue";
      default: return "gray";
    }
  };

  return (
    <AdminLayout>
      <Box>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg" color="gray.800">
            Bookings Management
          </Heading>
          <Box
            as="select"
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            width="200px"
            bg="white"
            p={2}
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            fontSize="sm"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Box>
        </HStack>

        <Box
          bg="white"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="sm"
          border="1px"
          borderColor="gray.200"
        >
          <Box as="table" width="100%" style={{ borderCollapse: "collapse" }}>
            <Box as="thead" bg="gray.50">
              <Box as="tr">
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Booking ID</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Guest Name</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Restaurant</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Date & Time</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Guests</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Amount</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Status</Box>
              </Box>
            </Box>
            <Box as="tbody">
              {filteredBookings.map((booking) => (
                <Box 
                  as="tr" 
                  key={booking.id}
                  _hover={{ bg: "gray.50" }}
                  borderBottom="1px"
                  borderColor="gray.100"
                >
                  <Box as="td" p={4} fontWeight="600">{booking.id}</Box>
                  <Box as="td" p={4}>
                    <Box>
                      <Text fontWeight="500">{booking.guestName}</Text>
                      <Text fontSize="xs" color="gray.500">{booking.guestEmail}</Text>
                    </Box>
                  </Box>
                  <Box as="td" p={4}>{booking.restaurantName}</Box>
                  <Box as="td" p={4}>
                    <Box>
                      <Text>{new Date(booking.date).toLocaleDateString()}</Text>
                      <Text fontSize="xs" color="gray.500">{booking.time}</Text>
                    </Box>
                  </Box>
                  <Box as="td" p={4}>{booking.guests}</Box>
                  <Box as="td" p={4} fontWeight="600" color="green.600">
                    ${booking.totalAmount}
                  </Box>
                  <Box as="td" p={4}>
                    <Badge colorScheme={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {filteredBookings.length === 0 && (
            <Box textAlign="center" py={10}>
              <Text color="gray.500">No bookings found</Text>
            </Box>
          )}
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default BookingsPage;