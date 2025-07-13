import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import useProducts from "@src/repository/useProducts.ts";
import { GRAMS } from "@src/utils/constants.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

type ProductDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (product: MappedProduct, amount: number) => void;
  filterProducts?: (product: MappedProduct) => boolean;
};

function ProductDialog({ open, setOpen, onAdd, filterProducts = () => true }: ProductDialogProps) {
  const { t } = useTranslation(["ProductDialog", "Shared"]);
  const { data: products } = useProducts();
  const [ingredientId, setIngredientId] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState<number | undefined>();

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, mt: 1 }}>
          <TextField
            select
            fullWidth
            label={t("product")}
            value={ingredientId}
            onChange={(event) => {
              setIngredientId(event.target.value);
              const product = products.find((product) => product.id === Number(event.target.value));
              if (product) setIngredientAmount(product.portion);
            }}
          >
            {products.filter(filterProducts).map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
          <NumericFormat
            customInput={TextField}
            suffix={GRAMS}
            fullWidth
            label={t("amount")}
            value={ingredientAmount}
            onValueChange={({ floatValue }) => setIngredientAmount(floatValue)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            const product = products.find((product) => product.id === Number(ingredientId));
            if (!product || !ingredientAmount) return;
            onAdd(product, ingredientAmount);
            setOpen(false);
            setIngredientId("");
            setIngredientAmount(undefined);
          }}
        >
          {t("Shared:add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductDialog;
