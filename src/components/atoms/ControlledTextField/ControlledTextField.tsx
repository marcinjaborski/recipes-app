import { TextField } from "@mui/material";
import { ComponentProps } from "react";
import { Controller, FieldValues } from "react-hook-form";

type ControlledTextFieldProps<T extends FieldValues> = Omit<ComponentProps<typeof Controller<T>>, "render"> &
  ComponentProps<typeof TextField>;

function ControlledTextField<T extends FieldValues>({
  control,
  name,
  rules,
  shouldUnregister,
  ...textFieldProps
}: ControlledTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <TextField
          fullWidth
          {...textFieldProps}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          error={!!error}
        />
      )}
    />
  );
}

export default ControlledTextField;
