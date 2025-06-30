import BottomFab from "@src/components/atoms/BottomFab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import routes from "@src/utils/routes.ts";

function ProductList() {
  const navigate = useNavigate();

  return (
    <>
      <BottomFab onClick={() => navigate(routes.productForm)}>
        <AddIcon />
      </BottomFab>
    </>
  );
}

export default ProductList;
