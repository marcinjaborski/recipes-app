export const PRODUCT_TYPE = {
  proteins: "proteins",
  carbohydrates: "carbohydrates",
  vegetable: "vegetable",
  fats: "fats",
  fruit: "fruit",
  dessert: "dessert",
  spice: "spice",
} as const;

export const MEAL_TIME = {
  breakfast: "breakfast",
  lunch: "lunch",
  dinner: "dinner",
  snack: "snack",
} as const;

export const TAG = {
  vegan: "vegan",
  fish: "fish",
  none: null,
} as const;

export const GRAMS = "g";
export const MULTIPLIER = "x";
export const DEFAULT_MULTIPLIER = 1;
export const HUNDRED = 100;

export const DAILY_CALORIES = 2250;
export const DAILY_PROTEINS = 150;
export const DAILY_FATS = 75;
export const DAILY_SATURATED_FATS = 25;
export const DAILY_CARBOHYDRATES = 244;
export const DAILY_SUGAR = 25;
export const DAILY_FIBER = 30;
export const DAILY_SALT = 5;
export const DAILY_VEGETABLES = 400;
