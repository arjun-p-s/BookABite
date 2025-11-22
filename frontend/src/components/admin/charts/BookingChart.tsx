import { Box, Heading, HStack } from "@chakra-ui/react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BookingChart = () => {
  const [period, setPeriod] = useState<"7" | "30">("7");

  // Dummy data for last 7 days
  const data7Days = [
    { date: "Jan 15", bookings: 12, capacity: 50 },
    { date: "Jan 16", bookings: 19, capacity: 50 },
    { date: "Jan 17", bookings: 25, capacity: 50 },
    { date: "Jan 18", bookings: 22, capacity: 50 },
    { date: "Jan 19", bookings: 30, capacity: 50 },
    { date: "Jan 20", bookings: 28, capacity: 50 },
    { date: "Jan 21", bookings: 35, capacity: 50 },
  ];

  // Dummy data for last 30 days (weekly aggregates)
  const data30Days = [
    { date: "Week 1", bookings: 85, capacity: 350 },
    { date: "Week 2", bookings: 120, capacity: 350 },
    { date: "Week 3", bookings: 145, capacity: 350 },
    { date: "Week 4", bookings: 160, capacity: 350 },
  ];

  const chartData = period === "7" ? data7Days : data30Days;

  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
      overflow="hidden"
      width="100%"
    >
      <HStack justify="space-between" mb={6} flexWrap="wrap" gap={3}>
        <Heading size={{ base: "sm", md: "md" }} color="gray.700">
          Booking Analytics
        </Heading>
        <Box
          as="select"
          value={period}
          onChange={(e: any) => setPeriod(e.target.value as "7" | "30")}
          w={{ base: "full", sm: "150px" }}
          fontSize="sm"
          p={2}
          borderRadius="md"
          border="1px"
          borderColor="gray.200"
          bg="white"
          cursor="pointer"
          _focus={{
            outline: "none",
            borderColor: "cyan.500",
            boxShadow: "0 0 0 1px #0ea5e9",
          }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </Box>
      </HStack>

      <Box width="100%" height={{ base: "250px", md: "300px" }} overflow="hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ fill: "#0ea5e9", r: 3 }}
              activeDot={{ r: 5 }}
              name="Bookings"
            />
            <Line
              type="monotone"
              dataKey="capacity"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Capacity"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default BookingChart;