import { Fab } from "@mui/material";
import { ComponentProps } from "react";

function BottomFab(props: ComponentProps<typeof Fab>) {
  return (
    <Fab
      {...props}
      color="primary"
      size="medium"
      sx={{ position: "fixed", right: "1rem", bottom: "4.375rem", ...props.sx }}
    />
  );
}

export default BottomFab;
