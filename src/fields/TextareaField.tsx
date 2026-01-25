import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";

interface TextareaFieldProps {
  field: FormField;
}

export function TextareaField({ field }: TextareaFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  return (
    <FieldWrapper field={field}>
      <textarea
        id={field.name}
        className={cn(
          "lub-form__textarea",
          hasError && "lub-form__textarea--error",
        )}
        placeholder={field.placeholder}
        rows={4}
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
