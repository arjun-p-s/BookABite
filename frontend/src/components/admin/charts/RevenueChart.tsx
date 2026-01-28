import { Box, Heading } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const RevenueChart = () => {
  const data = [
    { name: "Mon", revenue: 1200 },
    { name: "Tue", revenue: 1800 },
    { name: "Wed", revenue: 2200 },
    { name: "Thu", revenue: 2500 },
    { name: "Fri", revenue: 3200 },
    { name: "Sat", revenue: 4100 },
    { name: "Sun", revenue: 3800 },
  ];

  const colors = ["#0ea5e9", "#14b8a6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={6}
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
    >
      <Heading size="md" color="gray.700" mb={6}>
        Weekly Revenue
      </Heading>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
            formatter={(value) => `$${value}`}
          />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;