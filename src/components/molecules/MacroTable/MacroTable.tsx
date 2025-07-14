import { Typography } from "@mui/material";
import { Grid } from "@mui/system";
import _ from "lodash";
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
    <Grid container spacing={2} sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
      <Grid size={3}>
        <Typography>{t("calories", { calories: _.round(calories, 1) })}</Typography>
      </Grid>
      <Grid size={3}>
        <Typography>{t("proteins", { proteins: _.round(proteins, 1) })}</Typography>
      </Grid>
      <Grid size={3}>
        <Typography>{t("fats", { fats: _.round(fats, 1) })}</Typography>
      </Grid>
      <Grid size={3}>
        <Typography>{t("carbohydrates", { carbohydrates: _.round(carbohydrates, 1) })}</Typography>
      </Grid>
    </Grid>
  );
}

export default MacroTable;
