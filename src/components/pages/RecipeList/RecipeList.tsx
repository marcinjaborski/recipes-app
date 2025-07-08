import BottomFab from "@src/components/atoms/BottomFab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import routes from "@src/utils/routes.ts";
import useRecipes from "@src/repository/useRecipes.ts";

function RecipeList() {
  const navigate = useNavigate();
  const { data: recipes } = useRecipes();
  console.log(recipes);

  return (
    <>
      <BottomFab onClick={() => navigate(routes.recipesForm)}>
        <AddIcon />
      </BottomFab>
    </>
  );
}

export default RecipeList;
