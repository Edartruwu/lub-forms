import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";

interface FileFieldProps {
  field: FormField;
}

export function FileField({ field }: FileFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  const rules = field.validation_rules;
  const acceptTypes = rules?.allowed_types?.join(",");

  return (
    <FieldWrapper field={field}>
      <input
        id={field.name}
        type="file"
        className={cn(
          "lub-form__file-input",
          hasError && "lub-form__file-input--error",
        )}
        accept={acceptTypes}
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
      {rules?.max_file_size && (
        <p className="lub-form__file-hint">
          Max file size: {rules.max_file_size}MB
        </p>
      )}
    </FieldWrapper>
  );
}
