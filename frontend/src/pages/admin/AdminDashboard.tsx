import React from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Grid,
} from "@chakra-ui/react";
import {
  LuStore,
  LuCalendar,
  LuDollarSign,
  LuTrendingUp,
} from "react-icons/lu";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import BookingChart from "../../components/admin/charts/BookingChart";
import RevenueChart from "../../components/admin/charts/RevenueChart";
import { getBookingStats } from "../../data/dummyBooking";

const StatCard = ({
  label,
  value,
  helpText,
  icon: IconComponent,
  color,
}: {
  label: string;
  value: string | number;
  helpText: string;
  icon: React.ElementType;
  color: string;
}) => (
  <Box
    bg="white"
    p={6}
    borderRadius="xl"
    boxShadow="sm"
    border="1px"
    borderColor="gray.200"
    transition="all 0.3s"
    _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
  >
    <Flex justify="space-between" align="start" mb={4}>
      <Box>
        <Text fontSize="sm" color="gray.600" mb={2} fontWeight="500">
          {label}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          {value}
        </Text>
        <Flex align="center" gap={1} fontSize="xs" color="green.500" mt={2}>
          <LuTrendingUp size={12} />
          <Text>{helpText}</Text>
        </Flex>
      </Box>
      <Flex
        bg={`${color}.50`}
        p={3}
        borderRadius="lg"
        color={`${color}.500`}
      >
        <IconComponent size={24} />
      </Flex>
    </Flex>
  </Box>
);

const AdminDashboard = () => {
  const stats = getBookingStats();

  return (
    <AdminLayout>
      <Box maxW="100%" overflow="hidden">
        <Heading size="lg" mb={6} color="gray.800">
          Dashboard Overview
        </Heading>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
          <StatCard
            label="Total Restaurants"
            value="12"
            helpText="+2 this month"
            icon={LuStore}
            color="cyan"
          />
          <StatCard
            label="Total Bookings"
            value={stats.total}
            helpText="+12% from last week"
            icon={LuCalendar}
            color="teal"
          />
          <StatCard
            label="Revenue"
            value={`${stats.totalRevenue.toLocaleString()}`}
            helpText="+8% from last week"
            icon={LuDollarSign}
            color="green"
          />
          <StatCard
            label="Active Today"
            value={stats.confirmed}
            helpText="Confirmed bookings"
            icon={LuTrendingUp}
            color="purple"
          />
        </SimpleGrid>

        {/* Charts */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={6}
          mb={8}
          overflow="hidden"
        >
          <Box overflow="hidden">
            <BookingChart />
          </Box>
          <Box overflow="hidden">
            <RevenueChart />
          </Box>
        </Grid>

        {/* Recent Activity */}
        <Box
          bg="white"
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
          boxShadow="sm"
          border="1px"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Heading size="md" mb={4} color="gray.700">
            Recent Activity
          </Heading>
          <Box>
            {[
              {
                action: "New booking created",
                detail: "John Doe booked Skyline Social for 4 guests",
                time: "5 mins ago",
              },
              {
                action: "Restaurant added",
                detail: "New restaurant 'Ocean View' registered",
                time: "2 hours ago",
              },
              {
                action: "Booking cancelled",
                detail: "Sarah Williams cancelled Harvest & Hearth booking",
                time: "3 hours ago",
              },
            ].map((activity, index) => (
              <Flex
                key={index}
                py={3}
                borderBottom={index < 2 ? "1px" : "none"}
                borderColor="gray.100"
                gap={4}
                flexWrap="wrap"
              >
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="cyan.500"
                  mt={2}
                  flexShrink={0}
                />
                <Box flex="1" minW="0">
                  <Text fontWeight="600" fontSize="sm" color="gray.800">
                    {activity.action}
                  </Text>
                  <Text fontSize="xs" color="gray.600" mt={1} wordBreak="break-word">
                    {activity.detail}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    {activity.time}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;