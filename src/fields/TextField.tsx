import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";

interface TextFieldProps {
  field: FormField;
}

export function TextField({ field }: TextFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  // Determine input type based on field_type
  const inputType = getInputType(field.field_type);

  return (
    <FieldWrapper field={field}>
      <input
        id={field.name}
        type={inputType}
        className={cn("lub-form__input", hasError && "lub-form__input--error")}
        placeholder={field.placeholder}
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

function getInputType(fieldType: FormField["field_type"]): string {
  switch (fieldType) {
    case "email":
      return "email";
    case "phone":
      return "tel";
    case "url":
      return "url";
    case "text":
    default:
      return "text";
  }
}
