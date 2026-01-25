import type { ComponentType } from "react";
import type { FieldType, FormField } from "@/api/types";

import { TextField } from "./TextField";
import { TextareaField } from "./TextareaField";
import { NumberField } from "./NumberField";
import { SelectField } from "./SelectField";
import { RadioField } from "./RadioField";
import { CheckboxField } from "./CheckboxField";
import { CheckboxGroupField } from "./CheckboxGroupField";
import { DateField } from "./DateField";
import { TimeField } from "./TimeField";
import { DateTimeField } from "./DateTimeField";
import { FileField } from "./FileField";
import { HiddenField } from "./HiddenField";
import { CountryField } from "./CountryField";
import { StateField } from "./StateField";
import { HtmlField } from "./HtmlField";
import { DividerField } from "./DividerField";
import { RecaptchaField } from "./RecaptchaField";

// Field component type
export type FieldComponent = ComponentType<{ field: FormField }>;

// Field component registry
const fieldRegistry: Record<FieldType, FieldComponent> = {
  text: TextField,
  email: TextField,
  phone: TextField,
  url: TextField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  checkbox_group: CheckboxGroupField,
  date: DateField,
  time: TimeField,
  datetime: DateTimeField,
  file: FileField,
  hidden: HiddenField,
  country: CountryField,
  state: StateField,
  html: HtmlField,
  divider: DividerField,
  recaptcha: RecaptchaField,
};

/**
 * Get the component for a field type
 */
export function getFieldComponent(type: FieldType): FieldComponent | null {
  return fieldRegistry[type] ?? null;
}

/**
 * Register a custom field component
 */
export function registerFieldComponent(
  type: string,
  component: FieldComponent,
): void {
  (fieldRegistry as Record<string, FieldComponent>)[type] = component;
}

// Export all field components
export { FieldWrapper } from "./FieldWrapper";
export { TextField } from "./TextField";
export { TextareaField } from "./TextareaField";
export { NumberField } from "./NumberField";
export { SelectField } from "./SelectField";
export { RadioField } from "./RadioField";
export { CheckboxField } from "./CheckboxField";
export { CheckboxGroupField } from "./CheckboxGroupField";
export { DateField } from "./DateField";
export { TimeField } from "./TimeField";
export { DateTimeField } from "./DateTimeField";
export { FileField } from "./FileField";
export { HiddenField } from "./HiddenField";
export { CountryField } from "./CountryField";
export { StateField } from "./StateField";
export { HtmlField } from "./HtmlField";
export { DividerField } from "./DividerField";
export { RecaptchaField } from "./RecaptchaField";
