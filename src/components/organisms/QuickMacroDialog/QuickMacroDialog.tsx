import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import ControlledNumberField from "@src/components/atoms/ControlledNumberField";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import { GRAMS } from "@src/utils/constants.ts";
import { calculateCalories } from "@src/utils/functions.ts";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type QuickMacroFormData = {
  name: string;
  proteins: number;
  fats: number;
  carbohydrates: number;
};

type OnAddData = QuickMacroFormData & {
  calories: number;
};

type QuickMacroDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (data: OnAddData) => void;
};

function QuickMacroDialog({ open, setOpen, onAdd }: QuickMacroDialogProps) {
  const { t } = useTranslation(["QuickMacroDialog", "Shared"]);
  const { control, watch, reset, handleSubmit } = useForm<QuickMacroFormData>({
    defaultValues: {
      name: "",
    },
  });
  const calories = calculateCalories(watch("proteins"), watch("fats"), watch("carbohydrates"), 0);

  const onClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data: QuickMacroFormData) => {
    onAdd({ ...data, calories });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, mt: 1 }}>
          <ControlledTextField control={control} name="name" label={t("name")} rules={{ required: true }} />
          <Typography>{t("calories", { calories })}</Typography>
          <Stack direction="row" spacing={2}>
            <ControlledNumberField
              control={control}
              name="proteins"
              label={t("Shared:protein")}
              suffix={GRAMS}
              rules={{ required: true }}
            />
            <ControlledNumberField
              control={control}
              name="fats"
              label={t("Shared:fat")}
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
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="submit">{t("Shared:add")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuickMacroDialog;
