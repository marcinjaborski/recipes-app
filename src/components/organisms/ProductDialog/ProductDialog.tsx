import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import useProducts from "@src/repository/useProducts.ts";
import { INGREDIENT_MEASURE, IngredientMeasure, PRODUCT_TYPE } from "@src/utils/constants.ts";
import useSortedDataByRecord from "@src/utils/hooks/useSortedDataByRecord.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

type ProductDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  onAdd: (product: MappedProduct, amount: number, ingredientMeasure: IngredientMeasure, included: boolean) => void;
  filterProducts?: (product: MappedProduct) => boolean;
  includedCheckbox?: boolean;
  checkboxLabel?: string;
};

function ProductDialog({
  open,
  setOpen,
  title,
  onAdd,
  filterProducts = () => true,
  includedCheckbox = false,
  checkboxLabel = "",
}: ProductDialogProps) {
  const { t } = useTranslation(["ProductDialog", "IngredientMeasure", "Shared"]);
  const { data: products } = useProducts();
  const sortedProducts = useSortedDataByRecord(products, "type", PRODUCT_TYPE);
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState<number | undefined>(1);
  const [ingredientMeasure, setIngredientMeasure] = useState<IngredientMeasure>(INGREDIENT_MEASURE.portion);
  const [included, setIncluded] = useState(true);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>{title ?? t("title")}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, mt: 1 }}>
          <Autocomplete
            inputValue={productName}
            onInputChange={(_, newValue) => {
              setProductName(newValue);
            }}
            renderInput={(params) => <TextField {...params} label={t("product")} />}
            options={sortedProducts.filter(filterProducts).map((product) => product.name)}
          />
          <Stack direction="row" sx={{ gap: 2 }}>
            <NumericFormat
              customInput={TextField}
              fullWidth
              label={t("amount")}
              value={amount}
              onValueChange={({ floatValue }) => setAmount(floatValue)}
            />
            <Select
              fullWidth
              value={ingredientMeasure}
              onChange={(event) => setIngredientMeasure(event.target.value as IngredientMeasure)}
            >
              {Object.values(INGREDIENT_MEASURE).map((measure) => (
                <MenuItem key={measure} value={measure}>
                  {t(`IngredientMeasure:${measure}`)}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          {includedCheckbox ? (
            <FormControlLabel
              label={checkboxLabel}
              control={<Checkbox checked={included} onChange={(event) => setIncluded(event.target.checked)} />}
            />
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            const product = products.find((product) => product.name === productName);
            if (!product || !amount) return;
            onAdd(product, amount, ingredientMeasure, included);
            setOpen(false);
            setProductName("");
            setIngredientMeasure(INGREDIENT_MEASURE.portion);
            setAmount(1);
            setIncluded(true);
          }}
        >
          {t("Shared:add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductDialog;
