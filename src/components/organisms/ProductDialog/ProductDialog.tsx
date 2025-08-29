import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import useProducts from "@src/repository/useProducts.ts";
import { DEFAULT_MULTIPLIER, GRAMS, MULTIPLIER, PRODUCT_TYPE } from "@src/utils/constants.ts";
import useSortedDataByRecord from "@src/utils/hooks/useSortedDataByRecord.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

type ProductDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (product: MappedProduct, amount: number, multiplier: number, included: boolean) => void;
  filterProducts?: (product: MappedProduct) => boolean;
  includedCheckbox?: boolean;
  checkboxLabel?: string;
};

function ProductDialog({
  open,
  setOpen,
  onAdd,
  filterProducts = () => true,
  includedCheckbox = false,
  checkboxLabel = "",
}: ProductDialogProps) {
  const { t } = useTranslation(["ProductDialog", "Shared"]);
  const { data: products } = useProducts();
  const sortedProducts = useSortedDataByRecord(products, "type", PRODUCT_TYPE);
  const [productName, setProductName] = useState("");
  const [multiplier, setMultiplier] = useState<number | undefined>(DEFAULT_MULTIPLIER);
  const [amount, setAmount] = useState<number | undefined>();
  const [included, setIncluded] = useState(true);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, mt: 1 }}>
          <Autocomplete
            inputValue={productName}
            onInputChange={(_, newValue) => {
              setProductName(newValue);
              const product = products.find((product) => product.name === newValue);
              if (product) setAmount(product.portion);
            }}
            renderInput={(params) => <TextField {...params} label={t("product")} />}
            options={sortedProducts.filter(filterProducts).map((product) => product.name)}
          />
          <Stack direction="row" sx={{ gap: 2 }}>
            <NumericFormat
              customInput={TextField}
              suffix={MULTIPLIER}
              sx={{ width: 90 }}
              value={multiplier}
              onValueChange={({ floatValue }) => setMultiplier(floatValue)}
            />
            <NumericFormat
              customInput={TextField}
              suffix={GRAMS}
              fullWidth
              label={t("amount")}
              value={amount}
              onValueChange={({ floatValue }) => setAmount(floatValue)}
            />
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
            if (!product || !amount || !multiplier) return;
            onAdd(product, amount, multiplier, included);
            setOpen(false);
            setProductName("");
            setMultiplier(1);
            setAmount(undefined);
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
