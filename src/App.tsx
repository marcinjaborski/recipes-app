import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Feedback from "@src/components/atoms/Feedback";
import LoginDialog from "@src/components/organisms/LoginDialog";
import TopBar from "@src/components/organisms/TopBar";
import Calendar from "@src/components/pages/Calendar";
import DishForm from "@src/components/pages/DishForm";
import ProductForm from "@src/components/pages/ProductForm";
import ProductList from "@src/components/pages/ProductList";
import RecipeForm from "@src/components/pages/RecipeForm";
import RecipeList from "@src/components/pages/RecipeList";
import { Route, Routes } from "react-router-dom";

import Navigation from "./components/organisms/Navigation";
import routes from "./utils/routes";
import { mainTheme } from "./utils/theme.ts";

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
            <Route path={routes.recipesFormUpdate} element={<RecipeForm />} />
            <Route path={routes.calendar} element={<Calendar />} />
            <Route path={routes.dishForm} element={<DishForm />} />
          </Routes>
        </Box>
        <Navigation />
        <LoginDialog />
        <Feedback />
      </Box>
    </ThemeProvider>
  );
}

export default App;
