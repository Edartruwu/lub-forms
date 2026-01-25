import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { cn } from "@/utils/cn";

interface CheckboxFieldProps {
  field: FormField;
}

export function CheckboxField({ field }: CheckboxFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  return (
    <div
      className={cn(
        "lub-form__field-wrapper",
        hasError && "lub-form__field-wrapper--error",
      )}
    >
      <label className="lub-form__checkbox-label">
        <input
          id={field.name}
          type="checkbox"
          className={cn(
            "lub-form__checkbox",
            hasError && "lub-form__checkbox--error",
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
        />
        <span className="lub-form__checkbox-text">
          {field.label}
          {field.required && (
            <span className="lub-form__required-indicator" aria-hidden="true">
              *
            </span>
          )}
        </span>
      </label>

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
