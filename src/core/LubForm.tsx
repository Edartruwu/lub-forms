import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { useFormContext } from "react-hook-form";
import type {
  PublicFormResponse,
  FormDesign,
  SubmitFormResponse,
  ApiError,
} from "@/api/types";
import { LubFormsClient } from "@/api/client";
import { LubFormProvider } from "./FormProvider";
import { FormRenderer } from "./FormRenderer";
import { StepManager, StepNavigation } from "./StepManager";
import { buildFormSchema } from "@/validation/schema-builder";
import { applyCssVariables } from "@/utils/css-variables";
import { cn } from "@/utils/cn";

// Public component props
export interface LubFormProps {
  formId: string;
  baseUrl?: string;

  // Callbacks
  onSuccess?: (data: SubmitFormResponse) => void;
  onError?: (error: ApiError) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  onStepChange?: (step: number, total: number) => void;

  // Styling
  className?: string;
  style?: CSSProperties;
  designOverrides?: Partial<FormDesign>;
}

type FormState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; form: PublicFormResponse }
  | {
      status: "success";
      form: PublicFormResponse;
      response: SubmitFormResponse;
    };

export function LubForm({
  formId,
  baseUrl = "",
  onSuccess,
  onError,
  onValidationError,
  onStepChange,
  className,
  style,
  designOverrides,
}: LubFormProps) {
  const [state, setState] = useState<FormState>({ status: "loading" });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch form on mount
  useEffect(() => {
    const client = new LubFormsClient(baseUrl);

    client
      .getForm(formId)
      .then((form) => {
        setState({ status: "ready", form });
      })
      .catch((error: ApiError) => {
        setState({ status: "error", error: error.error });
        onError?.(error);
      });
  }, [formId, baseUrl, onError]);

  // Handle step change
  const handleStepChange = useCallback(
    (step: number) => {
      setCurrentStep(step);
      if (state.status === "ready") {
        const totalSteps = state.form.is_multi_step
          ? (state.form.steps?.length ?? 1)
          : 1;
        onStepChange?.(step, totalSteps);
      }
    },
    [state, onStepChange],
  );

  // Render based on state
  if (state.status === "loading") {
    return <FormSkeleton className={className} style={style} />;
  }

  if (state.status === "error") {
    return (
      <div className={cn("lub-form lub-form--error", className)} style={style}>
        <div className="lub-form__error-container">
          <p className="lub-form__error-message">{state.error}</p>
        </div>
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <SuccessMessage
        message={state.form.settings.success_message}
        className={className}
        style={style}
        design={mergeDesign(state.form.design, designOverrides)}
      />
    );
  }

  const { form } = state;
  const totalSteps = form.is_multi_step ? (form.steps?.length ?? 1) : 1;
  const mergedDesign = mergeDesign(form.design, designOverrides);
  const cssVars = applyCssVariables(mergedDesign);

  // Build validation schema
  const schema = buildFormSchema(form.fields);

  // Build default values
  const defaultValues = buildDefaultValues(form);

  return (
    <div className={cn("lub-form", className)} style={{ ...cssVars, ...style }}>
      <LubFormProvider
        form={form}
        schema={schema}
        defaultValues={defaultValues}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isSubmitting={isSubmitting}
        isSuccess={false}
        error={null}
        onStepChange={handleStepChange}
      >
        <FormContent
          form={form}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isSubmitting={isSubmitting}
          baseUrl={baseUrl}
          onSubmitStart={() => setIsSubmitting(true)}
          onSubmitEnd={() => setIsSubmitting(false)}
          onSuccess={(response) => {
            setState({ status: "success", form, response });
            onSuccess?.(response);
          }}
          onError={onError}
          onValidationError={onValidationError}
          onStepChange={handleStepChange}
        />
      </LubFormProvider>
    </div>
  );
}

// Internal form content component (needs form context)
interface FormContentProps {
  form: PublicFormResponse;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  baseUrl: string;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
  onSuccess: (response: SubmitFormResponse) => void;
  onError?: (error: ApiError) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  onStepChange: (step: number) => void;
}

function FormContent({
  form,
  currentStep,
  totalSteps,
  isSubmitting,
  baseUrl,
  onSubmitStart,
  onSubmitEnd,
  onSuccess,
  onError,
  onValidationError,
  onStepChange,
}: FormContentProps) {
  const { handleSubmit, trigger, formState } = useFormContext();
  const isLastStep = currentStep >= totalSteps - 1;

  // Get fields for current step
  const currentFields =
    form.is_multi_step && form.steps
      ? form.fields.filter((f) =>
          form.steps![currentStep]?.field_ids.includes(f.id),
        )
      : form.fields;

  // Validate current step before proceeding
  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldNames = currentFields
      .filter((f) => f.is_active)
      .map((f) => f.name);
    const result = await trigger(fieldNames);
    return result;
  };

  // Handle next step
  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      onStepChange(currentStep + 1);
    } else if (onValidationError) {
      const errors: Record<string, string> = {};
      for (const [key, value] of Object.entries(formState.errors)) {
        if (value?.message) {
          errors[key] = value.message as string;
        }
      }
      onValidationError(errors);
    }
  };

  // Handle form submission
  const onSubmit = async (data: Record<string, unknown>) => {
    onSubmitStart();

    try {
      const client = new LubFormsClient(baseUrl);
      const response = await client.submitForm(form.id, {
        data,
        referrer: typeof window !== "undefined" ? window.location.href : "",
        utm_parameters: getUTMParameters(),
      });
      onSuccess(response);
    } catch (error) {
      onError?.(error as ApiError);
    } finally {
      onSubmitEnd();
    }
  };

  return (
    <form
      className="lub-form__form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Header */}
      {(form.name || form.description) && (
        <div className="lub-form__header">
          {form.name && <h2 className="lub-form__title">{form.name}</h2>}
          {form.description && (
            <p className="lub-form__description">{form.description}</p>
          )}
        </div>
      )}

      {/* Step indicator */}
      {form.is_multi_step && form.steps && (
        <StepManager
          steps={form.steps}
          currentStep={currentStep}
          allowStepNavigation={false}
        />
      )}

      {/* Fields */}
      <FormRenderer fields={currentFields} layout={form.design.layout} />

      {/* Consent checkbox */}
      {form.settings.show_consent_checkbox && isLastStep && (
        <ConsentCheckbox text={form.settings.consent_text} />
      )}

      {/* Navigation / Submit */}
      {form.is_multi_step && totalSteps > 1 ? (
        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNextStep}
          onPrev={() => onStepChange(currentStep - 1)}
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
          submitButtonText={form.settings.submit_button_text || "Submit"}
        />
      ) : (
        <div className="lub-form__actions">
          <button
            type="submit"
            className="lub-form__button lub-form__button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="lub-form__button-loading">
                <LoadingSpinner />
                Submitting...
              </span>
            ) : (
              form.settings.submit_button_text || "Submit"
            )}
          </button>
        </div>
      )}
    </form>
  );
}

// Consent checkbox component
function ConsentCheckbox({ text }: { text?: string }) {
  const { register, formState } = useFormContext();
  const error = formState.errors._consent;

  return (
    <div className="lub-form__consent">
      <label className="lub-form__consent-label">
        <input
          type="checkbox"
          className="lub-form__consent-checkbox"
          {...register("_consent", {
            required: "You must agree to continue",
          })}
        />
        <span
          className="lub-form__consent-text"
          dangerouslySetInnerHTML={{
            __html: text || "I agree to the terms and conditions",
          }}
        />
      </label>
      {error && (
        <p className="lub-form__error" role="alert">
          {error.message as string}
        </p>
      )}
    </div>
  );
}

// Loading skeleton
function FormSkeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("lub-form lub-form--loading", className)} style={style}>
      <div className="lub-form__skeleton">
        <div className="lub-form__skeleton-title" />
        <div className="lub-form__skeleton-field" />
        <div className="lub-form__skeleton-field" />
        <div className="lub-form__skeleton-field lub-form__skeleton-field--short" />
        <div className="lub-form__skeleton-button" />
      </div>
    </div>
  );
}

// Success message
function SuccessMessage({
  message,
  className,
  style,
  design,
}: {
  message: string;
  className?: string;
  style?: CSSProperties;
  design: FormDesign;
}) {
  const cssVars = applyCssVariables(design);

  return (
    <div
      className={cn("lub-form lub-form--success", className)}
      style={{ ...cssVars, ...style }}
    >
      <div className="lub-form__success">
        <SuccessIcon />
        <p className="lub-form__success-message">{message}</p>
      </div>
    </div>
  );
}

function SuccessIcon() {
  return (
    <svg
      className="lub-form__success-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="lub-form__spinner" viewBox="0 0 24 24" fill="none">
      <circle
        className="lub-form__spinner-track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="lub-form__spinner-head"
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Helper functions
function mergeDesign(
  base: FormDesign,
  overrides?: Partial<FormDesign>,
): FormDesign {
  if (!overrides) return base;
  return { ...base, ...overrides };
}

function buildDefaultValues(form: PublicFormResponse): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  for (const field of form.fields) {
    if (field.default_value) {
      defaults[field.name] = field.default_value;
    }

    // Handle pre-selected options
    if (field.options?.options) {
      const selected = field.options.options.find((o) => o.selected);
      if (selected) {
        defaults[field.name] = selected.value;
      }
    }
  }

  return defaults;
}

function getUTMParameters() {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  const utmParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  for (const param of utmParams) {
    const value = params.get(param);
    if (value) {
      utm[param.replace("utm_", "")] = value;
    }
  }

  return Object.keys(utm).length > 0 ? utm : undefined;
}
