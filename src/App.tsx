import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { mainTheme } from "./utils/theme.ts";
import TopBar from "@src/components/organisms/TopBar";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/organisms/Navigation";
import routes from "./utils/routes";
import Feedback from "@src/components/atoms/Feedback";
import ProductList from "@src/components/pages/ProductList";
import RecipeList from "@src/components/pages/RecipeList";
import Calendar from "@src/components/pages/Calendar";
import ProductForm from "@src/components/pages/ProductForm";
import RecipeForm from "@src/components/pages/RecipeForm";
import DishForm from "@src/components/pages/DishForm";

function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <TopBar />
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Routes>
            <Route path={routes.productList} element={<ProductList />} />
            <Route path={routes.productForm} element={<ProductForm />} />
            <Route path={routes.productFormUpdate} element={<ProductForm />} />
            <Route path={routes.recipesList} element={<RecipeList />} />
            <Route path={routes.recipesForm} element={<RecipeForm />} />
            <Route path={routes.calendar} element={<Calendar />} />
            <Route path={routes.dishForm} element={<DishForm />} />
          </Routes>
        </Box>
        <Navigation />
        <Feedback />
      </Box>
    </ThemeProvider>
  );
}

export default App;
