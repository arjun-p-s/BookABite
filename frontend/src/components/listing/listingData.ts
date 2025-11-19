export type RestaurantListing = {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  reviews: number;
  image: string;
};

export const restaurantListings: RestaurantListing[] = [
  {
    id: 1,
    name: "Skyline Social",
    description: "Sunset lounge with modern tapas and signature cocktails.",
    cuisine: "Global Tapas",
    priceRange: "$$",
    rating: 4.8,
    reviews: 412,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Harvest & Hearth",
    description: "Seasonal farm-to-table dining with artisan breads and soups.",
    cuisine: "Farm Fresh",
    priceRange: "$$",
    rating: 4.7,
    reviews: 298,
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Azure Coast",
    description: "Seafood-forward menu inspired by Mediterranean coasts.",
    cuisine: "Mediterranean",
    priceRange: "$$$",
    rating: 4.9,
    reviews: 532,
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Ember House",
    description: "Charcoal grill experience with curated wine pairings.",
    cuisine: "Grill & Wine",
    priceRange: "$$$",
    rating: 4.6,
    reviews: 221,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Zen Bowl Studio",
    description: "Creative Asian bowls, matcha desserts, and tea flights.",
    cuisine: "Asian Fusion",
    priceRange: "$$",
    rating: 4.5,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Petal & Patisserie",
    description: "Paris-inspired dessert bar with petit fours and custom cakes.",
    cuisine: "Patisserie",
    priceRange: "$$",
    rating: 4.9,
    reviews: 364,
    image:
      "https://images.unsplash.com/photo-1481391041693-3c5c41d50d2c?auto=format&fit=crop&w=900&q=80",
  },
];

