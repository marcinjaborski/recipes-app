import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { mainTheme } from "./utils/theme.ts";
import TopBar from "@src/components/organisms/TopBar";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/organisms/Navigation";
import routes from "./utils/routes";
import Feedback from "@src/components/atoms/Feedback";


function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <TopBar />
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Routes>
            <Route path={routes.home} element={<></>} />
          </Routes>
        </Box>
        <Navigation />
        <Feedback />
      </Box>
    </ThemeProvider>
  );
}

export default App;
