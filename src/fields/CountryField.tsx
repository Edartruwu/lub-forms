import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "@/utils/cn";
import { countries } from "@/utils/countries";

interface CountryFieldProps {
  field: FormField;
}

export function CountryField({ field }: CountryFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name];
  const hasError = !!error;

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
        <option value="">{field.placeholder || "Select a country..."}</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
