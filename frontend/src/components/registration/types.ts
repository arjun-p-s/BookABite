export type RegistrationFormData = {
  // Basic Info
  restaurantName: string;
  email: string;
  phone: string;
  description: string;
  logoImage: File | null;
  galleryImages: File[];

  // Operational Details
  daysOpen: string[];
  openingTime: string;
  closingTime: string;
  cuisineTypes: string[];
  tags: string[];

  // Booking Details
  totalSeatingCapacity: string;
  tableTypes: TableType[];
  maxBookingPerSlot: string;

  // Location
  address: string;
  city: string;
  pincode: string;
  latitude: string;
  longitude: string;

  // Owner Details
  ownerName: string;
  ownerIdProof: File | null;
};

export type RestaurantRegistrationPayload = {
  name: string;
  email: string;
  phone: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  workingSchedule: { day: string; isOpen: boolean }[];
  timeSchedule: { openTime: string; closeTime: string };
  cuisineType: string[];
  specialTags: string[];
  totalCapacity: number;
  tableTypes: { seats: number; count: number }[];
  maxBookingPerSlot: number;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  geoCoordinates: { lat: number; lng: number };
  ownerName: string;
  ownerIdProof: string | null;
  accountStatus?: "pending" | "approved" | "rejected";
  isVerified?: boolean;
};

export type TableType = {
  id: string;
  type: string;
  capacity: string;
  count: string;
};

export type DayOption = {
  value: string;
  label: string;
};

export type CuisineOption = {
  value: string;
  label: string;
};

