export type Booking = {
    id: string;
    restaurantId: string;
    restaurantName: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guests: number;
    date: string;
    time: string;
    status: "confirmed" | "pending" | "cancelled" | "completed";
    totalAmount: number;
    createdAt: string;
  };
  
  export const dummyBookings: Booking[] = [
    {
      id: "BK001",
      restaurantId: "1",
      restaurantName: "Skyline Social",
      guestName: "John Doe",
      guestEmail: "john@example.com",
      guestPhone: "+1234567890",
      guests: 4,
      date: "2025-01-25",
      time: "19:00",
      status: "confirmed",
      totalAmount: 150,
      createdAt: "2025-01-20T10:30:00Z",
    },
    {
      id: "BK002",
      restaurantId: "2",
      restaurantName: "Harvest & Hearth",
      guestName: "Jane Smith",
      guestEmail: "jane@example.com",
      guestPhone: "+1234567891",
      guests: 2,
      date: "2025-01-26",
      time: "20:00",
      status: "pending",
      totalAmount: 80,
      createdAt: "2025-01-21T14:15:00Z",
    },
    {
      id: "BK003",
      restaurantId: "1",
      restaurantName: "Skyline Social",
      guestName: "Mike Johnson",
      guestEmail: "mike@example.com",
      guestPhone: "+1234567892",
      guests: 6,
      date: "2025-01-24",
      time: "18:30",
      status: "completed",
      totalAmount: 220,
      createdAt: "2025-01-19T09:00:00Z",
    },
    {
      id: "BK004",
      restaurantId: "3",
      restaurantName: "Azure Coast",
      guestName: "Sarah Williams",
      guestEmail: "sarah@example.com",
      guestPhone: "+1234567893",
      guests: 3,
      date: "2025-01-27",
      time: "19:30",
      status: "confirmed",
      totalAmount: 180,
      createdAt: "2025-01-22T11:45:00Z",
    },
    {
      id: "BK005",
      restaurantId: "2",
      restaurantName: "Harvest & Hearth",
      guestName: "David Brown",
      guestEmail: "david@example.com",
      guestPhone: "+1234567894",
      guests: 5,
      date: "2025-01-23",
      time: "20:30",
      status: "cancelled",
      totalAmount: 0,
      createdAt: "2025-01-18T16:20:00Z",
    },
  ];
  
  export const getBookingsByDateRange = (days: number) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    return dummyBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= startDate && bookingDate <= today;
    });
  };
  
  export const getBookingStats = () => {
    const total = dummyBookings.length;
    const confirmed = dummyBookings.filter(b => b.status === "confirmed").length;
    const pending = dummyBookings.filter(b => b.status === "pending").length;
    const completed = dummyBookings.filter(b => b.status === "completed").length;
    const cancelled = dummyBookings.filter(b => b.status === "cancelled").length;
    const totalRevenue = dummyBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    
    return { total, confirmed, pending, completed, cancelled, totalRevenue };
  };