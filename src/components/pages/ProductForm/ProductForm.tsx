import { Box, Button, ListItemText, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ControlledNumberField from "@src/components/atoms/ControlledNumberField";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import FishIcon from "@src/components/atoms/FishIcon";
import VeganIcon from "@src/components/atoms/VeganIcon";
import useProducts from "@src/repository/useProducts.ts";
import useUpsertProduct from "@src/repository/useUpsertProduct.ts";
import { setProductIdToEdit } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { GRAMS, HUNDRED, PRODUCT_TYPE, TAG } from "@src/utils/constants.ts";
import { calculateCalories } from "@src/utils/functions.ts";
import routes from "@src/utils/routes.ts";
import _ from "lodash";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
  tag: (typeof TAG)[keyof typeof TAG];
};

function ProductForm() {
  const { t } = useTranslation(["ProductForm", "Shared"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productIdToEdit } = useAppSelector((state) => state.global);
  const { data: products } = useProducts();
  const productToEdit = products.find((product) => product.id === productIdToEdit);
  const { control, watch, setValue, handleSubmit } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      type: PRODUCT_TYPE.proteins,
    },
  });
  const { mutate: upsertProduct } = useUpsertProduct({ onSuccess: () => navigate(routes.productList) });
  const caloriesPer100g = calculateCalories(watch("proteins"), watch("fats"), watch("carbohydrates"));
  const caloriesPerPortion = _.round((caloriesPer100g * watch("portion")) / HUNDRED || 0, 1);
  const onSubmit = (data: ProductFormData) => {
    upsertProduct(productToEdit ? { id: productToEdit.id, ...data } : data);
    dispatch(setProductIdToEdit(null));
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
    setValue("tag", productToEdit.tag);
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
      <Stack direction="row" spacing={2}>
        <ControlledNumberField
          control={control}
          name="portion"
          label={t("Shared:portion")}
          suffix={GRAMS}
          rules={{ required: true }}
        />
        <Controller
          control={control}
          name="tag"
          render={({ field }) => (
            <ToggleButtonGroup
              value={field.value}
              exclusive
              onChange={(_, value) => field.onChange(value)}
              color="primary"
            >
              <ToggleButton value={TAG.vegan}>
                <VeganIcon />
              </ToggleButton>
              <ToggleButton value={TAG.fish}>
                <FishIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </Stack>
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
