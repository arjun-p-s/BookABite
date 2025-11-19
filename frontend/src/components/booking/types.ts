export type FormData = {
  guestName: string;
  phone: string;
  email: string;
  guests: string;
  date: string;
  time: string;
  requests: string;
};

export type FoodItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

export type GalleryImage = {
  id: number;
  url: string;
  caption: string;
};

export type RestaurantDataBlock = {
  title: string;
  details: string[];
};

