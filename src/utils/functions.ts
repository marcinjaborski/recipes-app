export const calculateCalories = (proteins = 0, fats = 0, carbohydrates = 0) => {
  return proteins * 4 + fats * 9 + carbohydrates * 4;
};
