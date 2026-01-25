import { useFormContext, useWatch } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";
import { getStatesForCountry } from "@/utils/countries";

interface StateFieldProps {
  field: FormField;
  /** Name of the country field to watch for state filtering */
  countryFieldName?: string;
}

export function StateField({
  field,
  countryFieldName = "country",
}: StateFieldProps) {
  const { register, formState, control } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

  // Watch country field to filter states
  const countryValue = useWatch({
    control,
    name: countryFieldName,
    defaultValue: "",
  });

  const states = getStatesForCountry(countryValue as string);
  const hasStates = states.length > 0;

  // If no country selected or country has no states, show text input
  if (!hasStates) {
    return (
      <FieldWrapper field={field}>
        <input
          id={field.name}
          type="text"
          className={cn(
            "lub-form__input",
            hasError && "lub-form__input--error",
          )}
          placeholder={field.placeholder || "State/Province"}
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
        <option value="">{field.placeholder || "Select a state..."}</option>
        {states.map((state) => (
          <option key={state.code} value={state.code}>
            {state.name}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
