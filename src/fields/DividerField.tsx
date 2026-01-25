import type { FormField } from "@/api/types";

interface DividerFieldProps {
  field: FormField;
}

export function DividerField({ field }: DividerFieldProps) {
  return (
    <div className="lub-form__divider">
      <hr className="lub-form__divider-line" />
      {field.label && (
        <span className="lub-form__divider-label">{field.label}</span>
      )}
    </div>
  );
}
