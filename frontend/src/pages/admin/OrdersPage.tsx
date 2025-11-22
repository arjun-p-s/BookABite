import {
  Box,
  Heading,
  Badge,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { dummyOrders, type Order } from "../../data/dummyOrders";

const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredOrders = statusFilter === "all" 
    ? dummyOrders 
    : dummyOrders.filter(o => o.status === statusFilter);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered": return "green";
      case "ready": return "blue";
      case "preparing": return "yellow";
      case "pending": return "orange";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  return (
    <AdminLayout>
      <Box maxW="100%" overflow="hidden">
        <HStack justify="space-between" mb={6} flexWrap="wrap" gap={3}>
          <Heading size={{ base: "md", md: "lg" }} color="gray.800">
            Orders Management
          </Heading>
          <Box
            as="select"
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            width={{ base: "full", sm: "200px" }}
            bg="white"
            p={2}
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            fontSize="sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
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
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Order ID</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700" display={{ base: "none", md: "table-cell" }}>Customer</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700" display={{ base: "none", lg: "table-cell" }}>Restaurant</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700" display={{ base: "none", sm: "table-cell" }}>Items</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Amount</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700" display={{ base: "none", md: "table-cell" }}>Payment</Box>
                <Box as="th" textAlign="left" p={4} fontSize="sm" fontWeight="600" color="gray.700">Status</Box>
              </Box>
            </Box>
            <Box as="tbody">
              {filteredOrders.map((order) => (
                <Box 
                  as="tr" 
                  key={order.id}
                  _hover={{ bg: "gray.50" }}
                  borderBottom="1px"
                  borderColor="gray.100"
                >
                  <Box as="td" p={4} fontWeight="600" fontSize="sm">{order.id}</Box>
                  <Box as="td" p={4} fontSize="sm" display={{ base: "none", md: "table-cell" }}>{order.customerName}</Box>
                  <Box as="td" p={4} fontSize="sm" display={{ base: "none", lg: "table-cell" }}>{order.restaurantName}</Box>
                  <Box as="td" p={4} display={{ base: "none", sm: "table-cell" }}>
                    <HStack spacing={1} flexWrap="wrap">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <Badge key={idx} colorScheme="cyan" fontSize="xs" px={2} py={1} borderRadius="md">
                          {item}
                        </Badge>
                      ))}
                      {order.items.length > 2 && (
                        <Badge colorScheme="gray" fontSize="xs" px={2} py={1} borderRadius="md">
                          +{order.items.length - 2}
                        </Badge>
                      )}
                    </HStack>
                  </Box>
                  <Box as="td" p={4} fontWeight="600" color="green.600" fontSize="sm">
                    ${order.totalAmount}
                  </Box>
                  <Box as="td" p={4} display={{ base: "none", md: "table-cell" }}>
                    <Badge colorScheme="purple" textTransform="capitalize" fontSize="xs">
                      {order.paymentMethod}
                    </Badge>
                  </Box>
                  <Box as="td" p={4}>
                    <Badge colorScheme={getStatusColor(order.status)} textTransform="capitalize" fontSize="xs">
                      {order.status}
                    </Badge>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {filteredOrders.length === 0 && (
            <Box textAlign="center" py={10}>
              <Text color="gray.500">No orders found</Text>
            </Box>
          )}
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default OrdersPage;