import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";

interface CheckboxGroupFieldProps {
  field: FormField;
}

export function CheckboxGroupField({ field }: CheckboxGroupFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  const options = field.options?.options ?? [];

  return (
    <FieldWrapper field={field}>
      <div
        className="lub-form__checkbox-group"
        role="group"
        aria-labelledby={`${field.name}-label`}
      >
        {options.map((option) => (
          <label key={option.value} className="lub-form__checkbox-label">
            <input
              type="checkbox"
              className={cn(
                "lub-form__checkbox",
                hasError && "lub-form__checkbox--error",
              )}
              value={option.value}
              {...register(field.name)}
            />
            <span className="lub-form__checkbox-text">{option.label}</span>
          </label>
        ))}
        {field.options?.allow_other && (
          <label className="lub-form__checkbox-label">
            <input
              type="checkbox"
              className={cn(
                "lub-form__checkbox",
                hasError && "lub-form__checkbox--error",
              )}
              value="__other__"
              {...register(field.name)}
            />
            <span className="lub-form__checkbox-text">
              {field.options.other_label || "Other"}
            </span>
          </label>
        )}
      </div>
    </FieldWrapper>
  );
}
