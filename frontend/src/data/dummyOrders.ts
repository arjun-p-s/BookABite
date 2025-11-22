export type Order = {
    id: string;
    restaurantId: string;
    restaurantName: string;
    customerName: string;
    items: string[];
    totalAmount: number;
    status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
    orderDate: string;
    paymentMethod: "card" | "cash" | "online";
  };
  
  export const dummyOrders: Order[] = [
    {
      id: "ORD001",
      restaurantId: "1",
      restaurantName: "Skyline Social",
      customerName: "Alice Cooper",
      items: ["Truffle Risotto", "Caesar Salad", "Red Wine"],
      totalAmount: 85,
      status: "delivered",
      orderDate: "2025-01-21T18:30:00Z",
      paymentMethod: "card",
    },
    {
      id: "ORD002",
      restaurantId: "2",
      restaurantName: "Harvest & Hearth",
      customerName: "Bob Martin",
      items: ["Grilled Salmon", "Garlic Bread"],
      totalAmount: 45,
      status: "preparing",
      orderDate: "2025-01-21T19:15:00Z",
      paymentMethod: "online",
    },
    {
      id: "ORD003",
      restaurantId: "1",
      restaurantName: "Skyline Social",
      customerName: "Charlie Davis",
      items: ["Pasta Carbonara", "Tiramisu", "Espresso"],
      totalAmount: 38,
      status: "ready",
      orderDate: "2025-01-21T19:45:00Z",
      paymentMethod: "cash",
    },
    {
      id: "ORD004",
      restaurantId: "3",
      restaurantName: "Azure Coast",
      customerName: "Diana Prince",
      items: ["Mediterranean Platter", "Greek Salad", "White Wine"],
      totalAmount: 95,
      status: "pending",
      orderDate: "2025-01-21T20:00:00Z",
      paymentMethod: "card",
    },
  ];
  
  export const getOrdersByRestaurant = (restaurantId: string) => {
    return dummyOrders.filter(order => order.restaurantId === restaurantId);
  };
  
  export const getOrdersByStatus = (status: Order["status"]) => {
    return dummyOrders.filter(order => order.status === status);
  };