import { Typography } from "@mui/material";
import { Grid } from "@mui/system";
import _ from "lodash";
import { useTranslation } from "react-i18next";

type MacroTableProps = {
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  extra?: {
    saturatedFats: number;
    sugar: number;
    fiber: number;
    salt: number;
  };
};

function MacroTable({ calories, proteins, fats, carbohydrates, extra }: MacroTableProps) {
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
      {extra ? (
        <>
          <Grid size={3}>
            <Typography>{t("saturatedFats", { saturatedFats: _.round(extra.saturatedFats, 1) })}</Typography>
          </Grid>
          <Grid size={3}>
            <Typography>{t("sugar", { sugar: _.round(extra.sugar, 1) })}</Typography>
          </Grid>
          <Grid size={3}>
            <Typography>{t("fiber", { fiber: _.round(extra.fiber, 1) })}</Typography>
          </Grid>
          <Grid size={3}>
            <Typography>{t("salt", { salt: _.round(extra.salt, 2) })}</Typography>
          </Grid>
        </>
      ) : null}
    </Grid>
  );
}

export default MacroTable;
