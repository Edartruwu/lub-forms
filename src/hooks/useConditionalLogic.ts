import { useMemo } from "react";
import type { FormField } from "@/api/types";
import {
  evaluateFieldVisibility,
  evaluateFieldRequired,
  getVisibleFields,
  getRequiredFieldNames,
} from "@/validation/conditional";

interface UseConditionalLogicOptions {
  fields: FormField[];
  formValues: Record<string, unknown>;
}

interface UseConditionalLogicReturn {
  visibleFields: FormField[];
  requiredFieldNames: Set<string>;
  isFieldVisible: (fieldName: string) => boolean;
  isFieldRequired: (fieldName: string) => boolean;
}

export function useConditionalLogic({
  fields,
  formValues,
}: UseConditionalLogicOptions): UseConditionalLogicReturn {
  const visibleFields = useMemo(
    () => getVisibleFields(fields, formValues),
    [fields, formValues],
  );

  const requiredFieldNames = useMemo(
    () => getRequiredFieldNames(fields, formValues),
    [fields, formValues],
  );

  const fieldMap = useMemo(
    () => new Map(fields.map((f) => [f.name, f])),
    [fields],
  );

  const isFieldVisible = (fieldName: string): boolean => {
    const field = fieldMap.get(fieldName);
    if (!field) return false;
    return evaluateFieldVisibility(field, formValues);
  };

  const isFieldRequired = (fieldName: string): boolean => {
    const field = fieldMap.get(fieldName);
    if (!field) return false;
    return evaluateFieldRequired(field, formValues);
  };

  return {
    visibleFields,
    requiredFieldNames,
    isFieldVisible,
    isFieldRequired,
  };
}
