import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";

interface SelectFieldProps {
  field: FormField;
}

export function SelectField({ field }: SelectFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  const options = field.options?.options ?? [];

  return (
    <FieldWrapper field={field}>
      <select
        id={field.name}
        className={cn(
          "lub-form__select",
          hasError && "lub-form__select--error",
        )}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? `${field.name}-error`
            : field.help_text
              ? `${field.name}-help`
              : undefined
        }
        {...register(field.name)}
      >
        <option value="">{field.placeholder || "Select an option..."}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {field.options?.allow_other && (
          <option value="__other__">
            {field.options.other_label || "Other"}
          </option>
        )}
      </select>
    </FieldWrapper>
  );
}
