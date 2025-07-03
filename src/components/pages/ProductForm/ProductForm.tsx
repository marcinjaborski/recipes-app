import { Box, Button, ListItemText, MenuItem, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import { useTranslation } from "react-i18next";
import ControlledNumberField from "@src/components/atoms/ControlledNumberField";
import { calculateCalories } from "@src/utils/functions.ts";
import useUpsert from "@src/repository/useUpsert.ts";
import routes from "@src/utils/routes.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { setProductToEdit } from "@src/store/GlobalSlice.ts";
import { useEffect } from "react";
import { PRODUCT_TYPE } from "@src/utils/constants.ts";

export type ProductFormData = {
  name: string;
  proteins: number;
  fats: number;
  carbohydrates: number;
  portion: number;
  type: string;
};

function ProductForm() {
  const { t } = useTranslation(["ProductForm", "Shared"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productToEdit } = useAppSelector((state) => state.global);
  const { control, watch, handleSubmit } = useForm<ProductFormData>({
    defaultValues: productToEdit
      ? {
          name: productToEdit.name,
          proteins: productToEdit.proteins,
          fats: productToEdit.fats,
          carbohydrates: productToEdit.carbohydrates,
          portion: productToEdit.portion,
          type: productToEdit.type,
        }
      : {
          name: "",
          type: PRODUCT_TYPE.proteins,
        },
  });
  const { mutate: upsertProduct } = useUpsert("products", { onSuccess: () => navigate(routes.productList) });
  const calories = calculateCalories(watch("proteins"), watch("fats"), watch("carbohydrates"));
  const onSubmit = (data: ProductFormData) => {
    upsertProduct(productToEdit ? { id: productToEdit.id, ...data } : data);
    dispatch(setProductToEdit(null));
  };

  useEffect(() => {
    if (!productToEdit) navigate(routes.productForm);
  }, [navigate, productToEdit]);

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
      <Stack direction="row" spacing={2}>
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
      <ControlledTextField select control={control} name="type" label={t("type")}>
        {Object.values(PRODUCT_TYPE).map((type) => (
          <MenuItem key={type} value={type}>
            <ListItemText>{t(type)}</ListItemText>
          </MenuItem>
        ))}
      </ControlledTextField>

      <Box sx={{ flex: 1 }} />

      <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
        {productToEdit ? t("Shared:edit") : t("Shared:create")}
      </Button>
    </Stack>
  );
}

export default ProductForm;
