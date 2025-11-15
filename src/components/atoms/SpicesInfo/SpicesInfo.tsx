import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type SpicesInfoProps = {
  spices: string[];
};

function SpicesInfo({ spices }: SpicesInfoProps) {
  const { t } = useTranslation();

  if (!spices.length) return null;

  return (
    <Typography variant="body2">
      {t("Shared:spices")}
      <span style={{ textTransform: "lowercase" }}>{spices.join(", ")}</span>
    </Typography>
  );
}

export default SpicesInfo;
