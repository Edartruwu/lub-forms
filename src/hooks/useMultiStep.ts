import { useState, useCallback, useMemo } from "react";
import type { FormStep, FormField } from "@/api/types";

interface UseMultiStepOptions {
  steps: FormStep[];
  fields: FormField[];
  onStepChange?: (step: number, total: number) => void;
}

interface UseMultiStepReturn {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepData: FormStep | null;
  currentStepFields: FormField[];
  progress: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export function useMultiStep({
  steps,
  fields,
  onStepChange,
}: UseMultiStepOptions): UseMultiStepReturn {
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = steps.length || 1;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= totalSteps - 1;

  const currentStepData = useMemo(
    () => steps[currentStep] ?? null,
    [steps, currentStep],
  );

  const currentStepFields = useMemo(() => {
    if (!currentStepData) {
      return fields.filter((f) => f.is_active);
    }

    const stepFieldIds = new Set(currentStepData.field_ids);
    return fields.filter((f) => f.is_active && stepFieldIds.has(f.id));
  }, [currentStepData, fields]);

  const progress = useMemo(() => {
    if (totalSteps <= 1) return 100;
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
        onStepChange?.(step, totalSteps);
      }
    },
    [totalSteps, onStepChange],
  );

  const nextStep = useCallback(() => {
    if (!isLastStep) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep, totalSteps);
    }
  }, [currentStep, isLastStep, totalSteps, onStepChange]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep, totalSteps);
    }
  }, [currentStep, isFirstStep, totalSteps, onStepChange]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    onStepChange?.(0, totalSteps);
  }, [totalSteps, onStepChange]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    currentStepData,
    currentStepFields,
    progress,
    goToStep,
    nextStep,
    prevStep,
    reset,
  };
}
