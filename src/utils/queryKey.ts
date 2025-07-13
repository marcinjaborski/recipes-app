export type DishFilters = {
  date: string;
};

const queryKey = {
  products: {
    all: ["products"] as const,
  },
  recipes: {
    all: ["recipes"] as const,
  },
  dishes: {
    all: ["dishes"] as const,
    list: (filters: DishFilters) => [...queryKey.dishes.all, { filters }],
  },
  recipes_products: {
    all: ["recipes_products"] as const,
  },
};

export default queryKey;
