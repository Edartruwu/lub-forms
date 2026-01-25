// Types matching backend marketing/forms DTOs

// Field types
export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "number"
  | "url"
  | "date"
  | "time"
  | "datetime"
  | "select"
  | "radio"
  | "checkbox"
  | "checkbox_group"
  | "file"
  | "hidden"
  | "country"
  | "state"
  | "html"
  | "divider"
  | "recaptcha";

// Field width
export type FieldWidth = "full" | "half" | "third" | "quarter";

// Conditional operators
export type Operator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "is_empty"
  | "is_not_empty";

// Form layout
export type FormLayout = "vertical" | "horizontal" | "two_column";

// Validation rules
export interface ValidationRules {
  min_length?: number;
  max_length?: number;
  min?: number;
  max?: number;
  pattern?: string;
  allowed_types?: string[];
  max_file_size?: number;
  custom_error?: string;
}

// Select option
export interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
}

// Field options (for select, radio, checkbox_group)
export interface FieldOptions {
  options: SelectOption[];
  allow_other?: boolean;
  other_label?: string;
  multiple?: boolean;
  searchable?: boolean;
}

// Conditional logic
export interface Condition {
  field_name: string;
  operator: Operator;
  value: unknown;
  and?: Condition[];
  or?: Condition[];
}

export interface ConditionalLogic {
  show_if?: Condition;
  hide_if?: Condition;
  required_if?: Condition;
}

// CRM mapping
export interface CRMMapping {
  object_type: string;
  field_name: string;
  is_custom_field?: boolean;
}

// Form field response
export interface FormField {
  id: string;
  field_type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  default_value?: string;
  help_text?: string;
  display_order: number;
  required: boolean;
  validation_rules?: ValidationRules;
  options?: FieldOptions;
  conditional_logic?: ConditionalLogic;
  crm_mapping?: CRMMapping;
  width: FieldWidth;
  css_class?: string;
  is_active: boolean;
}

// Button style
export interface ButtonStyle {
  background_color?: string;
  text_color?: string;
  border_radius?: string;
  size?: "small" | "medium" | "large";
  full_width?: boolean;
}

// Form design
export interface FormDesign {
  layout: FormLayout;
  theme: string;
  background_color?: string;
  text_color?: string;
  primary_color?: string;
  border_color?: string;
  font_family?: string;
  font_size?: string;
  padding?: string;
  field_spacing?: string;
  button_style?: ButtonStyle;
  custom_css?: string;
  show_logo?: boolean;
  logo_url?: string;
}

// Form step (for multi-step forms)
export interface FormStep {
  id: string;
  name: string;
  description?: string;
  field_ids: string[];
  display_order: number;
}

// Public form settings
export interface PublicFormSettings {
  submit_button_text: string;
  success_message: string;
  enable_recaptcha: boolean;
  recaptcha_site_key?: string;
  show_consent_checkbox: boolean;
  consent_text?: string;
}

// Public form response (from GET /public/forms/:id)
export interface PublicFormResponse {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  design: FormDesign;
  is_multi_step: boolean;
  steps?: FormStep[];
  settings: PublicFormSettings;
}

// UTM parameters
export interface UTMParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// Submit form request
export interface SubmitFormRequest {
  data: Record<string, unknown>;
  utm_parameters?: UTMParameters;
  referrer?: string;
  recaptcha_token?: string;
  honeypot?: string;
}

// Submit form response
export interface SubmitFormResponse {
  success: boolean;
  submission_id: string;
  message: string;
  requires_confirmation?: boolean;
}

// API Error response
export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}
