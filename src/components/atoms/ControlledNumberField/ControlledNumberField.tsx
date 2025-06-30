import { TextField } from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { ComponentProps } from "react";
import { NumericFormat } from "react-number-format";

type ControlledTextFieldProps<T extends FieldValues> = Omit<ComponentProps<typeof Controller<T>>, "render"> &
  ComponentProps<typeof NumericFormat<ComponentProps<typeof TextField>>>;

function ControlledNumberField<T extends FieldValues>({
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
        <NumericFormat
          customInput={TextField}
          fullWidth
          {...textFieldProps}
          value={value}
          onValueChange={({ floatValue }) => onChange(floatValue)}
          error={!!error}
        />
      )}
    />
  );
}

export default ControlledNumberField;
