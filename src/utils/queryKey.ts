const queryKey = {
  products: {
    all: ["products"] as const,
  },
  recipes: {
    all: ["recipes"] as const,
  },
  dishes: {
    all: ["products"] as const,
  },
  recipes_products: {
    all: ["recipes_products"] as const,
  },
};

export default queryKey;
