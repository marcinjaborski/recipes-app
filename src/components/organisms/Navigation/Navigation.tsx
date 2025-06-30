import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../../../utils/routes";
import EggIcon from "@mui/icons-material/Egg";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuBookIcon from "@mui/icons-material/MenuBook";

function Navigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <BottomNavigation value={pathname} onChange={(_, route) => navigate(route)}>
      <BottomNavigationAction icon={<EggIcon />} value={routes.productList} />
      <BottomNavigationAction icon={<CalendarTodayIcon />} value={routes.calendar} />
      <BottomNavigationAction icon={<MenuBookIcon />} value={routes.recipesList} />
    </BottomNavigation>
  );
}

export default Navigation;
