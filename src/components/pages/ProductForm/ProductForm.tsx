import { Box, Button, ListItemText, MenuItem, Stack, Typography } from "@mui/material";
import ControlledNumberField from "@src/components/atoms/ControlledNumberField";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import useUpsertProduct from "@src/repository/useUpsertProduct.ts";
import { setProductToEdit } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { GRAMS, HUNDRED, PRODUCT_TYPE } from "@src/utils/constants.ts";
import { calculateCalories } from "@src/utils/functions.ts";
import routes from "@src/utils/routes.ts";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export type ProductFormData = {
  name: string;
  proteins: number;
  fats: number;
  saturatedFats: number;
  carbohydrates: number;
  sugar: number;
  fiber: number;
  salt: number;
  portion: number;
  type: string;
};

function ProductForm() {
  const { t } = useTranslation(["ProductForm", "Shared"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productToEdit } = useAppSelector((state) => state.global);
  const { control, watch, setValue, handleSubmit } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      type: PRODUCT_TYPE.proteins,
    },
  });
  const { mutate: upsertProduct } = useUpsertProduct({ onSuccess: () => navigate(routes.productList) });
  const caloriesPer100g = calculateCalories(watch("proteins"), watch("fats"), watch("carbohydrates"));
  const caloriesPerPortion = (caloriesPer100g * watch("portion")) / HUNDRED || 0;
  const onSubmit = (data: ProductFormData) => {
    upsertProduct(productToEdit ? { id: productToEdit.id, ...data } : data);
    dispatch(setProductToEdit(null));
  };

  useEffect(() => {
    if (!productToEdit) {
      navigate(routes.productForm);
      return;
    }
    setValue("name", productToEdit.name);
    setValue("proteins", productToEdit.proteins);
    setValue("fats", productToEdit.fats);
    setValue("saturatedFats", productToEdit.saturatedFats);
    setValue("carbohydrates", productToEdit.carbohydrates);
    setValue("sugar", productToEdit.sugar);
    setValue("fiber", productToEdit.fiber);
    setValue("salt", productToEdit.salt);
    setValue("portion", productToEdit.portion);
    setValue("type", productToEdit.type);
  }, [navigate, setValue, productToEdit]);

  return (
    <Stack component="form" spacing={2} sx={{ p: 3, height: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <ControlledTextField control={control} name="name" label={t("name")} rules={{ required: true }} />
      <ControlledTextField select control={control} name="type" label={t("type")}>
        {Object.values(PRODUCT_TYPE).map((type) => (
          <MenuItem key={type} value={type}>
            <ListItemText>{t(type)}</ListItemText>
          </MenuItem>
        ))}
      </ControlledTextField>
      <ControlledNumberField
        control={control}
        name="portion"
        label={t("Shared:portion")}
        suffix={GRAMS}
        rules={{ required: true }}
      />
      <Typography>{t("calories", { calories: caloriesPer100g, caloriesPerPortion })}</Typography>
      <ControlledNumberField
        control={control}
        name="fats"
        label={t("Shared:fat")}
        suffix={GRAMS}
        rules={{ required: true }}
      />
      <ControlledNumberField
        control={control}
        name="saturatedFats"
        label={t("Shared:saturatedFat")}
        suffix={GRAMS}
        rules={{ required: true }}
      />
      <ControlledNumberField
        control={control}
        name="carbohydrates"
        label={t("Shared:carbohydrates")}
        suffix={GRAMS}
        rules={{ required: true }}
      />
      <ControlledNumberField
        control={control}
        name="sugar"
        label={t("Shared:sugar")}
        suffix={GRAMS}
        rules={{ required: true }}
      />
      <ControlledNumberField
        control={control}
        name="fiber"
        label={t("Shared:fiber")}
        suffix={GRAMS}
        rules={{ required: true }}
      />
      <ControlledNumberField
        control={control}
        name="proteins"
        label={t("Shared:protein")}
        suffix={GRAMS}
        rules={{ required: true }}
      />
      <ControlledNumberField
        control={control}
        name="salt"
        label={t("Shared:salt")}
        suffix={GRAMS}
        rules={{ required: true }}
      />

      <Box sx={{ flex: 1 }} />

      <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
        {productToEdit ? t("Shared:edit") : t("Shared:create")}
      </Button>
    </Stack>
  );
}

export default ProductForm;
