import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";

interface RadioFieldProps {
  field: FormField;
}

export function RadioField({ field }: RadioFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  const options = field.options?.options ?? [];

  return (
    <FieldWrapper field={field}>
      <div
        className="lub-form__radio-group"
        role="radiogroup"
        aria-labelledby={`${field.name}-label`}
      >
        {options.map((option) => (
          <label key={option.value} className="lub-form__radio-label">
            <input
              type="radio"
              className={cn(
                "lub-form__radio",
                hasError && "lub-form__radio--error",
              )}
              value={option.value}
              {...register(field.name)}
            />
            <span className="lub-form__radio-text">{option.label}</span>
          </label>
        ))}
        {field.options?.allow_other && (
          <label className="lub-form__radio-label">
            <input
              type="radio"
              className={cn(
                "lub-form__radio",
                hasError && "lub-form__radio--error",
              )}
              value="__other__"
              {...register(field.name)}
            />
            <span className="lub-form__radio-text">
              {field.options.other_label || "Other"}
            </span>
          </label>
        )}
      </div>
    </FieldWrapper>
  );
}
