import { Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { useTranslation } from "react-i18next";

type MacroTableProps = {
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
};

function MacroTable({ calories, proteins, fats, carbohydrates }: MacroTableProps) {
  const { t } = useTranslation("MacroTable");

  return (
    <Grid container spacing={2} sx={{ textAlign: "center" }}>
      <Grid size={3}>
        <Typography>{t("calories", { calories })}</Typography>
      </Grid>
      <Grid size={3}>
        <Typography>{t("proteins", { proteins })}</Typography>
      </Grid>
      <Grid size={3}>
        <Typography>{t("fats", { fats })}</Typography>
      </Grid>
      <Grid size={3}>
        <Typography>{t("carbohydrates", { carbohydrates })}</Typography>
      </Grid>
    </Grid>
  );
}

export default MacroTable;
