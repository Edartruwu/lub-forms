import { z, type ZodTypeAny } from "zod";
import type { FormField, FieldType } from "@/api/types";

/**
 * Build a Zod schema from form field definitions
 */
export function buildFormSchema(fields: FormField[]): z.ZodSchema {
  const shape: Record<string, ZodTypeAny> = {};

  for (const field of fields) {
    if (!field.is_active) continue;

    // Skip non-input fields
    if (isNonInputField(field.field_type)) continue;

    shape[field.name] = buildFieldSchema(field);
  }

  return z.object(shape);
}

/**
 * Build a Zod schema for a single field
 */
export function buildFieldSchema(field: FormField): ZodTypeAny {
  let schema: ZodTypeAny;

  switch (field.field_type) {
    case "text":
    case "textarea":
    case "hidden":
      schema = buildStringSchema(field);
      break;

    case "email":
      schema = buildEmailSchema(field);
      break;

    case "phone":
      schema = buildPhoneSchema(field);
      break;

    case "url":
      schema = buildUrlSchema(field);
      break;

    case "number":
      schema = buildNumberSchema(field);
      break;

    case "date":
    case "time":
    case "datetime":
      schema = buildDateSchema(field);
      break;

    case "select":
    case "radio":
    case "country":
    case "state":
      schema = buildSelectSchema(field);
      break;

    case "checkbox":
      schema = buildCheckboxSchema(field);
      break;

    case "checkbox_group":
      schema = buildCheckboxGroupSchema(field);
      break;

    case "file":
      schema = buildFileSchema(field);
      break;

    default:
      schema = z.any();
  }

  // Make optional if not required
  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

function buildStringSchema(field: FormField): ZodTypeAny {
  let schema = z.string();

  const rules = field.validation_rules;
  const customError = rules?.custom_error;

  if (field.required) {
    schema = schema.min(1, customError || `${field.label} is required`);
  }

  if (rules?.min_length) {
    schema = schema.min(
      rules.min_length,
      customError ||
        `${field.label} must be at least ${rules.min_length} characters`,
    );
  }

  if (rules?.max_length) {
    schema = schema.max(
      rules.max_length,
      customError ||
        `${field.label} must be at most ${rules.max_length} characters`,
    );
  }

  if (rules?.pattern) {
    schema = schema.regex(
      new RegExp(rules.pattern),
      customError || `${field.label} has an invalid format`,
    );
  }

  return schema;
}

function buildEmailSchema(field: FormField): ZodTypeAny {
  let schema = z.string();
  const customError = field.validation_rules?.custom_error;

  if (field.required) {
    schema = schema.min(1, customError || `${field.label} is required`);
  }

  schema = schema.email(customError || "Please enter a valid email address");

  return schema;
}

function buildPhoneSchema(field: FormField): ZodTypeAny {
  let schema = z.string();
  const customError = field.validation_rules?.custom_error;

  if (field.required) {
    schema = schema.min(1, customError || `${field.label} is required`);
  }

  // Basic phone validation: at least 10 digits
  schema = schema.refine(
    (val) => {
      if (!val) return true;
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10;
    },
    { message: customError || "Please enter a valid phone number" },
  );

  return schema;
}

function buildUrlSchema(field: FormField): ZodTypeAny {
  let schema = z.string();
  const customError = field.validation_rules?.custom_error;

  if (field.required) {
    schema = schema.min(1, customError || `${field.label} is required`);
  }

  schema = schema.url(customError || "Please enter a valid URL");

  return schema;
}

function buildNumberSchema(field: FormField): ZodTypeAny {
  let schema = z.coerce.number({
    invalid_type_error: `${field.label} must be a number`,
  });

  const rules = field.validation_rules;
  const customError = rules?.custom_error;

  if (rules?.min !== undefined) {
    schema = schema.min(
      rules.min,
      customError || `${field.label} must be at least ${rules.min}`,
    );
  }

  if (rules?.max !== undefined) {
    schema = schema.max(
      rules.max,
      customError || `${field.label} must be at most ${rules.max}`,
    );
  }

  // For optional number fields, allow empty string
  if (!field.required) {
    return z.union([schema, z.literal("").transform(() => undefined)]);
  }

  return schema;
}

function buildDateSchema(field: FormField): ZodTypeAny {
  let schema = z.string();
  const customError = field.validation_rules?.custom_error;

  if (field.required) {
    schema = schema.min(1, customError || `${field.label} is required`);
  }

  // Validate date format
  schema = schema.refine(
    (val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: customError || "Please enter a valid date" },
  );

  return schema;
}

function buildSelectSchema(field: FormField): ZodTypeAny {
  let schema = z.string();
  const customError = field.validation_rules?.custom_error;

  if (field.required) {
    schema = schema.min(1, customError || `${field.label} is required`);
  }

  // Validate against options if available and allow_other is false
  if (field.options?.options && !field.options.allow_other) {
    const validValues = field.options.options.map((o) => o.value);
    schema = schema.refine((val) => !val || validValues.includes(val), {
      message: customError || "Please select a valid option",
    });
  }

  return schema;
}

function buildCheckboxSchema(field: FormField): ZodTypeAny {
  const customError = field.validation_rules?.custom_error;

  if (field.required) {
    return z.literal(true, {
      errorMap: () => ({
        message: customError || `${field.label} is required`,
      }),
    });
  }

  return z.boolean().optional();
}

function buildCheckboxGroupSchema(field: FormField): ZodTypeAny {
  let schema = z.array(z.string());
  const customError = field.validation_rules?.custom_error;

  if (field.required) {
    schema = schema.min(1, customError || `Please select at least one option`);
  }

  // Validate against options if available
  if (field.options?.options && !field.options.allow_other) {
    const validValues = new Set(field.options.options.map((o) => o.value));
    schema = schema.refine((arr) => arr.every((val) => validValues.has(val)), {
      message: customError || "Please select valid options",
    });
  }

  return schema;
}

function buildFileSchema(field: FormField): ZodTypeAny {
  const rules = field.validation_rules;
  const customError = rules?.custom_error;

  let schema = z.instanceof(File).or(z.instanceof(FileList));

  // Validate file type
  if (rules?.allowed_types && rules.allowed_types.length > 0) {
    schema = schema.refine(
      (file) => {
        if (!file) return true;
        const files = file instanceof FileList ? Array.from(file) : [file];
        return files.every((f) =>
          rules.allowed_types!.some(
            (type) =>
              f.type === type ||
              f.name.toLowerCase().endsWith(`.${type.replace(".", "")}`),
          ),
        );
      },
      {
        message:
          customError ||
          `File must be one of: ${rules.allowed_types.join(", ")}`,
      },
    );
  }

  // Validate file size
  if (rules?.max_file_size) {
    const maxBytes = rules.max_file_size * 1024 * 1024; // MB to bytes
    schema = schema.refine(
      (file) => {
        if (!file) return true;
        const files = file instanceof FileList ? Array.from(file) : [file];
        return files.every((f) => f.size <= maxBytes);
      },
      {
        message:
          customError || `File must be smaller than ${rules.max_file_size}MB`,
      },
    );
  }

  if (!field.required) {
    return schema.optional().nullable();
  }

  return schema;
}

function isNonInputField(type: FieldType): boolean {
  return ["html", "divider", "recaptcha"].includes(type);
}
