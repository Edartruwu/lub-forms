import type { Condition, FormField, Operator } from "@/api/types";

/**
 * Evaluate if a field should be visible based on its conditional logic
 */
export function evaluateFieldVisibility(
  field: FormField,
  formValues: Record<string, unknown>,
): boolean {
  const logic = field.conditional_logic;
  if (!logic) return true;

  // Check show_if condition
  if (logic.show_if) {
    return evaluateCondition(logic.show_if, formValues);
  }

  // Check hide_if condition
  if (logic.hide_if) {
    return !evaluateCondition(logic.hide_if, formValues);
  }

  return true;
}

/**
 * Evaluate if a field should be required based on its conditional logic
 */
export function evaluateFieldRequired(
  field: FormField,
  formValues: Record<string, unknown>,
): boolean {
  const logic = field.conditional_logic;

  // Start with base required state
  let isRequired = field.required;

  // Check required_if condition
  if (logic?.required_if) {
    const conditionMet = evaluateCondition(logic.required_if, formValues);
    isRequired = isRequired || conditionMet;
  }

  return isRequired;
}

/**
 * Evaluate a condition against form values
 */
export function evaluateCondition(
  condition: Condition,
  formValues: Record<string, unknown>,
): boolean {
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

  // Evaluate OR conditions - at least one must be true
  if (condition.or && condition.or.length > 0) {
    let orResult = false;
    for (const orCond of condition.or) {
      if (evaluateCondition(orCond, formValues)) {
        orResult = true;
        break;
      }
    }
    // For OR conditions to pass, main condition AND at least one OR must be true
    result = result && orResult;
  }

  return result;
}

/**
 * Compare field value against condition value using the specified operator
 */
function compareValues(
  fieldValue: unknown,
  operator: Operator,
  compareValue: unknown,
): boolean {
  switch (operator) {
    case "equals":
      return normalizeValue(fieldValue) === normalizeValue(compareValue);

    case "not_equals":
      return normalizeValue(fieldValue) !== normalizeValue(compareValue);

    case "contains":
      return String(fieldValue ?? "")
        .toLowerCase()
        .includes(String(compareValue).toLowerCase());

    case "not_contains":
      return !String(fieldValue ?? "")
        .toLowerCase()
        .includes(String(compareValue).toLowerCase());

    case "greater_than":
      return Number(fieldValue) > Number(compareValue);

    case "less_than":
      return Number(fieldValue) < Number(compareValue);

    case "is_empty":
      return isEmpty(fieldValue);

    case "is_not_empty":
      return !isEmpty(fieldValue);

    default:
      return true;
  }
}

/**
 * Normalize value for comparison
 */
function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.sort().join(",");
  return String(value).toLowerCase().trim();
}

/**
 * Check if value is empty
 */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Get all fields that should be visible based on conditional logic
 */
export function getVisibleFields(
  fields: FormField[],
  formValues: Record<string, unknown>,
): FormField[] {
  return fields.filter((field) => evaluateFieldVisibility(field, formValues));
}

/**
 * Get required field names based on conditional logic
 */
export function getRequiredFieldNames(
  fields: FormField[],
  formValues: Record<string, unknown>,
): Set<string> {
  const required = new Set<string>();

  for (const field of fields) {
    if (evaluateFieldRequired(field, formValues)) {
      required.add(field.name);
    }
  }

  return required;
}
