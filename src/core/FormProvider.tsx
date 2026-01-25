import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  useForm,
  FormProvider as RHFFormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { PublicFormResponse, FormField } from "@/api/types";

// Form context types
interface LubFormContextValue {
  form: PublicFormResponse;
  fields: FormField[];
  currentStep: number;
  totalSteps: number;
  isMultiStep: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  getFieldsForCurrentStep: () => FormField[];
  getVisibleFields: (formValues: FieldValues) => FormField[];
}

const LubFormContext = createContext<LubFormContextValue | null>(null);

export function useLubFormContext(): LubFormContextValue {
  const context = useContext(LubFormContext);
  if (!context) {
    throw new Error("useLubFormContext must be used within a LubFormProvider");
  }
  return context;
}

// Props
interface LubFormProviderProps {
  form: PublicFormResponse;
  schema: z.ZodSchema;
  defaultValues?: Record<string, unknown>;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  onStepChange: (step: number) => void;
  children: ReactNode;
}

export function LubFormProvider({
  form,
  schema,
  defaultValues,
  currentStep,
  totalSteps,
  isSubmitting,
  isSuccess,
  error,
  onStepChange,
  children,
}: LubFormProviderProps) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const isMultiStep = form.is_multi_step && (form.steps?.length ?? 0) > 0;

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      onStepChange(step);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const getFieldsForCurrentStep = (): FormField[] => {
    if (!isMultiStep || !form.steps) {
      return form.fields.filter((f) => f.is_active);
    }

    const step = form.steps[currentStep];
    if (!step) return [];

    const stepFieldIds = new Set(step.field_ids);
    return form.fields.filter((f) => f.is_active && stepFieldIds.has(f.id));
  };

  const getVisibleFields = (formValues: FieldValues): FormField[] => {
    const stepFields = getFieldsForCurrentStep();
    return stepFields.filter((field) => {
      if (!field.conditional_logic) return true;
      return evaluateFieldVisibility(field, formValues);
    });
  };

  const contextValue = useMemo(
    (): LubFormContextValue => ({
      form,
      fields: form.fields,
      currentStep,
      totalSteps,
      isMultiStep,
      isSubmitting,
      isSuccess,
      error,
      goToStep,
      nextStep,
      prevStep,
      getFieldsForCurrentStep,
      getVisibleFields,
    }),
    [form, currentStep, totalSteps, isSubmitting, isSuccess, error],
  );

  return (
    <LubFormContext.Provider value={contextValue}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </LubFormContext.Provider>
  );
}

// Helper to evaluate field visibility based on conditional logic
function evaluateFieldVisibility(
  field: FormField,
  formValues: FieldValues,
): boolean {
  const logic = field.conditional_logic;
  if (!logic) return true;

  // Check show_if
  if (logic.show_if) {
    return evaluateCondition(logic.show_if, formValues);
  }

  // Check hide_if
  if (logic.hide_if) {
    return !evaluateCondition(logic.hide_if, formValues);
  }

  return true;
}

function evaluateCondition(
  condition: NonNullable<FormField["conditional_logic"]>["show_if"],
  formValues: FieldValues,
): boolean {
  if (!condition) return true;

  const fieldValue = formValues[condition.field_name];
  let result = compareValues(fieldValue, condition.operator, condition.value);

  // Evaluate AND conditions
  if (condition.and && condition.and.length > 0) {
    for (const andCond of condition.and) {
      if (!evaluateCondition(andCond, formValues)) {
        return false;
      }
    }
  }

  // Evaluate OR conditions
  if (condition.or && condition.or.length > 0) {
    let orResult = false;
    for (const orCond of condition.or) {
      if (evaluateCondition(orCond, formValues)) {
        orResult = true;
        break;
      }
    }
    result = result && orResult;
  }

  return result;
}

function compareValues(
  fieldValue: unknown,
  operator: string,
  compareValue: unknown,
): boolean {
  switch (operator) {
    case "equals":
      return fieldValue === compareValue;
    case "not_equals":
      return fieldValue !== compareValue;
    case "contains":
      return String(fieldValue ?? "").includes(String(compareValue));
    case "not_contains":
      return !String(fieldValue ?? "").includes(String(compareValue));
    case "greater_than":
      return Number(fieldValue) > Number(compareValue);
    case "less_than":
      return Number(fieldValue) < Number(compareValue);
    case "is_empty":
      return fieldValue == null || fieldValue === "";
    case "is_not_empty":
      return fieldValue != null && fieldValue !== "";
    default:
      return true;
  }
}

// Export React Hook Form methods hook
export function useFormMethods(): UseFormReturn {
  const methods = useContext(
    RHFFormProvider as unknown as React.Context<UseFormReturn | null>,
  );
  if (!methods) {
    throw new Error("useFormMethods must be used within a LubFormProvider");
  }
  return methods;
}
