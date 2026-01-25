import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";

interface TimeFieldProps {
  field: FormField;
}

export function TimeField({ field }: TimeFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  return (
    <FieldWrapper field={field}>
      <input
        id={field.name}
        type="time"
        className={cn("lub-form__input", hasError && "lub-form__input--error")}
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
