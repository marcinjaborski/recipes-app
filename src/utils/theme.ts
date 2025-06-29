import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f49ac2",
    },
    secondary: {
      main: "#41fbd0",
    },
    success: {
      main: "#90ee90",
    },
    error: {
      main: "#ff6347",
    },
    background: {
      default: "#2d2d2d",
    },
  },
  shape: { borderRadius: 12 },
  spacing: 6,
  typography: {
    fontFamily: ["Montserrat", "Roboto", "serif"].join(", "),
  },
});
