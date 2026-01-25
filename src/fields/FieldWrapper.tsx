import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { cn } from "@/utils/cn";

interface FieldWrapperProps {
  field: FormField;
  children: ReactNode;
  hideLabel?: boolean;
}

export function FieldWrapper({
  field,
  children,
  hideLabel = false,
}: FieldWrapperProps) {
  const { formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  return (
    <div
      className={cn(
        "lub-form__field-wrapper",
        hasError && "lub-form__field-wrapper--error",
      )}
    >
      {!hideLabel && field.label && (
        <label
          htmlFor={field.name}
          className={cn(
            "lub-form__label",
            field.required && "lub-form__label--required",
          )}
        >
          {field.label}
          {field.required && (
            <span className="lub-form__required-indicator" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {field.help_text && !hasError && (
        <p className="lub-form__help-text" id={`${field.name}-help`}>
          {field.help_text}
        </p>
      )}

      {hasError && (
        <p className="lub-form__error" id={`${field.name}-error`} role="alert">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
