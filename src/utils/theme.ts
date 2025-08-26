import { createTheme, PaletteColorOptions } from "@mui/material";
import { amber, brown, cyan, green, grey, indigo, pink } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    calories?: PaletteColorOptions;
    proteins?: PaletteColorOptions;
    fats?: PaletteColorOptions;
    saturatedFats?: PaletteColorOptions;
    carbohydrates?: PaletteColorOptions;
    sugar?: PaletteColorOptions;
    fiber?: PaletteColorOptions;
    salt?: PaletteColorOptions;
    vegetables?: PaletteColorOptions;
  }
}

declare module "@mui/material/LinearProgress" {
  interface LinearProgressPropsColorOverrides {
    calories: true;
    proteins: true;
    fats: true;
    saturatedFats: true;
    carbohydrates: true;
    sugar: true;
    fiber: true;
    salt: true;
    vegetables: true;
  }
}

export const mainTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#41fbd0",
    },
    secondary: {
      main: "#f49ac2",
    },
    calories: {
      main: pink[200],
    },
    proteins: {
      main: cyan[400],
    },
    fats: {
      main: amber[400],
    },
    saturatedFats: {
      main: amber[200],
    },
    carbohydrates: {
      main: indigo[400],
    },
    sugar: {
      main: indigo[300],
    },
    fiber: {
      main: brown[400],
    },
    salt: {
      main: grey[400],
    },
    vegetables: {
      main: green[300],
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
