import { LinearProgress, Stack, Typography } from "@mui/material";
import _ from "lodash";
import { ComponentProps } from "react";

type MacroCounterProps = {
  text: string;
  value: number;
  total: number;
  color: ComponentProps<typeof LinearProgress>["color"];
};

function MacroCounter({ text, value, total, color }: MacroCounterProps) {
  return (
    <Stack>
      <Typography>
        {text} {_.round(value)}/{total}
      </Typography>
      <LinearProgress variant="determinate" value={(value / total) * 100} color={color} />
    </Stack>
  );
}

export default MacroCounter;
