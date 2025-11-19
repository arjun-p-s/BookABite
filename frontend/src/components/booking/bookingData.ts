import type { FoodItem, GalleryImage, RestaurantDataBlock } from "./types";

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    caption: "Skyline View Dining",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80",
    caption: "Cozy Indoor Seating",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    caption: "Chef's Signature Kitchen",
  },
];

export const menuItems: FoodItem[] = [
  {
    id: 1,
    name: "Truffle Risotto",
    price: 22,
    description: "Creamy Arborio rice with wild mushrooms and white truffle oil",
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Seared Salmon",
    price: 28,
    description: "Atlantic salmon with citrus glaze and herb couscous",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Garden Salad",
    price: 14,
    description: "Organic greens, avocado, toasted seeds, citrus dressing",
    image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d12?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Herb Lamb Chops",
    price: 32,
    description: "Char-grilled lamb, rosemary jus, roasted root veggies",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Chocolate Soufflé",
    price: 16,
    description: "Dark chocolate, vanilla bean ice cream, raspberry coulis",
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=600&q=80",
  },
];

export const restaurantDataBlocks: RestaurantDataBlock[] = [
  {
    title: "Table Inventory",
    details: ["32 total tables", "8 outdoor cabanas", "4 private lounges"],
  },
  {
    title: "Seating Capacity",
    details: ["2-seat: 12 tables", "4-seat: 14 tables", "6-seat: 6 tables"],
  },
  {
    title: "Operating Hours",
    details: ["Monday - Sunday", "12:00 PM - 11:00 PM", "Last seating at 10:15 PM"],
  },
  {
    title: "Reservation Rules",
    details: ["Max party size: 8", "30 min buffer between seatings", "Peak hours: 7-9 PM"],
  },
];

