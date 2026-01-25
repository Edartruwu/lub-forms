import type { FormField } from "@/api/types";

interface HtmlFieldProps {
  field: FormField;
}

export function HtmlField({ field }: HtmlFieldProps) {
  // HTML fields display static content from default_value
  if (!field.default_value) return null;

  return (
    <div
      className="lub-form__html-content"
      dangerouslySetInnerHTML={{ __html: field.default_value }}
    />
  );
}
