import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { FormStep } from "@/api/types";

interface StepManagerProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  allowStepNavigation?: boolean;
}

export function StepManager({
  steps,
  currentStep,
  onStepClick,
  allowStepNavigation = false,
}: StepManagerProps) {
  if (steps.length <= 1) return null;

  return (
    <div className="lub-form__steps" role="navigation" aria-label="Form steps">
      <ol className="lub-form__steps-list">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = allowStepNavigation && (isCompleted || isActive);

          return (
            <li
              key={step.id}
              className={cn(
                "lub-form__step",
                isActive && "lub-form__step--active",
                isCompleted && "lub-form__step--completed",
              )}
            >
              {isClickable ? (
                <button
                  type="button"
                  className="lub-form__step-button"
                  onClick={() => onStepClick?.(index)}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="lub-form__step-number">{index + 1}</span>
                  <span className="lub-form__step-name">{step.name}</span>
                </button>
              ) : (
                <span
                  className="lub-form__step-indicator"
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="lub-form__step-number">
                    {isCompleted ? <CheckIcon /> : index + 1}
                  </span>
                  <span className="lub-form__step-name">{step.name}</span>
                </span>
              )}
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "lub-form__step-connector",
                    isCompleted && "lub-form__step-connector--completed",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      {steps[currentStep]?.description && (
        <p className="lub-form__step-description">
          {steps[currentStep].description}
        </p>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="lub-form__check-icon"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Step navigation buttons
interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  submitButtonText?: string;
  nextButtonText?: string;
  prevButtonText?: string;
  children?: ReactNode;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  isNextDisabled = false,
  isPrevDisabled = false,
  isLastStep = false,
  isSubmitting = false,
  submitButtonText = "Submit",
  nextButtonText = "Next",
  prevButtonText = "Back",
  children,
}: StepNavigationProps) {
  const showPrev = currentStep > 0;
  const showNext = !isLastStep;

  return (
    <div className="lub-form__navigation">
      {showPrev && (
        <button
          type="button"
          className="lub-form__button lub-form__button--secondary"
          onClick={onPrev}
          disabled={isPrevDisabled || isSubmitting}
        >
          {prevButtonText}
        </button>
      )}
      <div className="lub-form__navigation-spacer" />
      {showNext ? (
        <button
          type="button"
          className="lub-form__button lub-form__button--primary"
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
        >
          {nextButtonText}
        </button>
      ) : (
        (children ?? (
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
              submitButtonText
            )}
          </button>
        ))
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="lub-form__spinner"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
