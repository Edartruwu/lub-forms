import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";

interface NumberFieldProps {
  field: FormField;
}

export function NumberField({ field }: NumberFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  const rules = field.validation_rules;

  return (
    <FieldWrapper field={field}>
      <input
        id={field.name}
        type="number"
        className={cn("lub-form__input", hasError && "lub-form__input--error")}
        placeholder={field.placeholder}
        min={rules?.min}
        max={rules?.max}
        step="any"
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? `${field.name}-error`
            : field.help_text
              ? `${field.name}-help`
              : undefined
        }
        {...register(field.name)}
      />
    </FieldWrapper>
  );
}
