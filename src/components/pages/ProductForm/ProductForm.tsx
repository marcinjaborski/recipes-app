import { Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import { useTranslation } from "react-i18next";
import ControlledNumberField from "@src/components/atoms/ControlledNumberField";
import { calculateCalories } from "@src/utils/functions.ts";
import useUpsert from "@src/repository/useUpsert.ts";
import routes from "@src/utils/routes.ts";
import { useNavigate } from "react-router-dom";

export type ProductFormData = {
  name: string;
  proteins: number;
  fats: number;
  carbohydrates: number;
  portion: number;
};

function ProductForm() {
  const { t } = useTranslation(["ProductForm", "Shared"]);
  const navigate = useNavigate();
  const { control, watch, handleSubmit } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
    },
  });
  const { mutate } = useUpsert("products", { onSuccess: () => navigate(routes.productList) });
  const calories = calculateCalories(watch("proteins"), watch("fats"), watch("carbohydrates"));
  const onSubmit = (data: ProductFormData) => {
    mutate(data);
  };

  return (
    <Stack component="form" spacing={2} sx={{ p: 3, height: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <ControlledTextField control={control} name="name" label={t("name")} rules={{ required: true }} />
      <ControlledNumberField
        control={control}
        name="portion"
        label={t("Shared:portion")}
        suffix="g"
        rules={{ required: true }}
      />
      <Typography>{t("calories", { calories })}</Typography>
      <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
        <ControlledNumberField
          control={control}
          name="proteins"
          label={t("Shared:protein")}
          suffix="g"
          rules={{ required: true }}
        />
        <ControlledNumberField
          control={control}
          name="fats"
          label={t("Shared:fat")}
          suffix="g"
          rules={{ required: true }}
        />
        <ControlledNumberField
          control={control}
          name="carbohydrates"
          label={t("Shared:carbohydrates")}
          suffix="g"
          rules={{ required: true }}
        />
      </Stack>

      <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
        {t("Shared:create")}
      </Button>
    </Stack>
  );
}

export default ProductForm;
