import type { DayOption, CuisineOption } from "./types";

export const daysOfWeek: DayOption[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export const cuisineOptions: CuisineOption[] = [
  { value: "italian", label: "Italian" },
  { value: "chinese", label: "Chinese" },
  { value: "indian", label: "Indian" },
  { value: "mexican", label: "Mexican" },
  { value: "japanese", label: "Japanese" },
  { value: "thai", label: "Thai" },
  { value: "french", label: "French" },
  { value: "american", label: "American" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "korean", label: "Korean" },
];

export const popularTags = [
  "Fine Dining",
  "Casual Dining",
  "Family Friendly",
  "Romantic",
  "Outdoor Seating",
  "Live Music",
  "Bar",
  "Vegetarian",
  "Vegan",
  "Gluten Free",
];

