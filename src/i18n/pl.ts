const resource = {
  TopBar: {
    title: {
      default: "Przepisy",
      "/productList": "Produkty",
      "/productForm": "Nowy produkt",
      "/productForm/update": "Edytuj produkt",
      "/calendar": "Tracker",
      "/dishForm": "Dodaj posiłek",
      "/recipesList": "Przepisy",
      "/recipesForm": "Nowy przepis",
    },
  },
  ProductList: {
    name: "Nazwa",
    calories: "kcal",
    proteins: "B",
    fats: "T",
    carbohydrates: "W",
    portion: "Porcja",
    confirmDelete: "Czy na pewno usunąć ten produkt?",
  },
  ProductForm: {
    name: "Nazwa",
    calories: "Kalorie: {{calories}}",
  },
  Feedback: {
    error: "Coś poszło nie tak",
  },
  Shared: {
    protein: "Białko",
    fat: "Tłuszcze",
    carbohydrates: "Węglowodany",
    portion: "Porcja",
    create: "Stwórz",
    edit: "Edytuj",
    delete: "Usuń",
    confirm: "Potwierdź",
    cancel: "Anuluj",
    close: "Zamknij",
  },
};

export default resource;
