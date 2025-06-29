import { AppBar, Toolbar, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { isValidRoute } from "@src/utils/routes.ts";

function TopBar() {
  const { t } = useTranslation("TopBar");
  const { pathname } = useLocation();

  const getTitle = () => {
    if (isValidRoute(pathname)) return t(`title.${pathname}`);
    return t("title.default");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">{getTitle()}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
