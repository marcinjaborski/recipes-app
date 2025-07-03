import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmDialog({ title, open, onCancel, onConfirm }: Props) {
  const { t } = useTranslation("Shared");

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>{t("cancel")}</Button>
        <Button variant="contained" onClick={onConfirm}>
          {t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
