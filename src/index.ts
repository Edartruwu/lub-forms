// Main ESM entry point for @lub/forms

// Core component
export { LubForm, type LubFormProps } from "./core/LubForm";

// Context and providers
export { LubFormProvider, useLubFormContext } from "./core/FormProvider";

// Rendering components
export { FormRenderer } from "./core/FormRenderer";
export { StepManager, StepNavigation } from "./core/StepManager";

// Field components
export {
  getFieldComponent,
  registerFieldComponent,
  type FieldComponent,
  FieldWrapper,
  TextField,
  TextareaField,
  NumberField,
  SelectField,
  RadioField,
  CheckboxField,
  CheckboxGroupField,
  DateField,
  TimeField,
  DateTimeField,
  FileField,
  HiddenField,
  CountryField,
  StateField,
  HtmlField,
  DividerField,
  RecaptchaField,
} from "./fields";

// API client
export {
  LubFormsClient,
  createClient,
  setDefaultClient,
  getDefaultClient,
} from "./api/client";

// Types
export type {
  FieldType,
  FieldWidth,
  Operator,
  FormLayout,
  ValidationRules,
  SelectOption,
  FieldOptions,
  Condition,
  ConditionalLogic,
  CRMMapping,
  FormField,
  ButtonStyle,
  FormDesign,
  FormStep,
  PublicFormSettings,
  PublicFormResponse,
  UTMParameters,
  SubmitFormRequest,
  SubmitFormResponse,
  ApiError,
} from "./api/types";

// Validation
export { buildFormSchema, buildFieldSchema } from "./validation/schema-builder";
export {
  evaluateFieldVisibility,
  evaluateFieldRequired,
  evaluateCondition,
  getVisibleFields,
  getRequiredFieldNames,
} from "./validation/conditional";

// Hooks
export { useFormApi } from "./hooks/useFormApi";
export { useConditionalLogic } from "./hooks/useConditionalLogic";
export { useMultiStep } from "./hooks/useMultiStep";
export { useFormDesign } from "./hooks/useFormDesign";

// Utilities
export { cn } from "./utils/cn";
export {
  formDesignToCssVariables,
  applyCssVariables,
} from "./utils/css-variables";
export {
  countries,
  usStates,
  caProvinces,
  getStatesForCountry,
  getCountryByCode,
  getStateByCode,
  type Country,
  type State,
} from "./utils/countries";
