import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../../../utils/routes";
import DashboardIcon from "@mui/icons-material/Dashboard";

function Navigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <BottomNavigation value={pathname} onChange={(_, route) => navigate(route)}>
      <BottomNavigationAction icon={<DashboardIcon />} value={routes.home} />
    </BottomNavigation>
  );
}

export default Navigation;
