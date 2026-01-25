import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";

interface HiddenFieldProps {
  field: FormField;
}

export function HiddenField({ field }: HiddenFieldProps) {
  const { register } = useFormContext();

  return (
    <input
      type="hidden"
      {...register(field.name)}
      defaultValue={field.default_value}
    />
  );
}
