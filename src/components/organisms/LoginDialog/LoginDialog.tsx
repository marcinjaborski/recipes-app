import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import supabase from "@src/utils/supabase.ts";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type FormData = {
  email: string;
  password: string;
};

function LoginDialog() {
  const { t } = useTranslation("LoginDialog");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedOut(!session));
  }, []);

  const onSubmit = async (data: FormData) => {
    const {
      data: { user },
    } = await supabase.auth.signInWithPassword(data);
    if (user) setIsLoggedOut(false);
  };

  return (
    <Dialog open={isLoggedOut} fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 1, gap: 2 }}>
          <ControlledTextField control={control} name="email" label={t("email")} />
          <ControlledTextField control={control} name="password" type="password" label={t("password")} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="submit">{t("button")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginDialog;
