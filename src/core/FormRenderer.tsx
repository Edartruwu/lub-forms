import { useFormContext, type FieldValues } from "react-hook-form";
import type { FormField, FormLayout } from "@/api/types";
import { cn } from "@/utils/cn";
import { getFieldComponent } from "@/fields";
import { useLubFormContext } from "./FormProvider";

interface FormRendererProps {
  fields: FormField[];
  layout?: FormLayout;
}

export function FormRenderer({
  fields,
  layout = "vertical",
}: FormRendererProps) {
  const { watch } = useFormContext();
  const { getVisibleFields } = useLubFormContext();

  // Watch all form values to re-evaluate conditional logic
  const formValues = watch();
  const visibleFields = getVisibleFields(formValues);

  // Group fields for two-column layout
  const fieldGroups =
    layout === "two_column"
      ? groupFieldsForTwoColumn(visibleFields)
      : visibleFields.map((f) => [f]);

  return (
    <div className={cn("lub-form__fields", `lub-form__fields--${layout}`)}>
      {fieldGroups.map((group, groupIndex) => (
        <div
          key={group.map((f) => f.id).join("-") || groupIndex}
          className={cn(
            "lub-form__field-group",
            group.length > 1 && "lub-form__field-group--row",
          )}
        >
          {group.map((field) => (
            <FieldRenderer key={field.id} field={field} />
          ))}
        </div>
      ))}
    </div>
  );
}

interface FieldRendererProps {
  field: FormField;
}

function FieldRenderer({ field }: FieldRendererProps) {
  const FieldComponent = getFieldComponent(field.field_type);

  if (!FieldComponent) {
    console.warn(`Unknown field type: ${field.field_type}`);
    return null;
  }

  const widthClass = getWidthClass(field.width);

  return (
    <div className={cn("lub-form__field", widthClass, field.css_class)}>
      <FieldComponent field={field} />
    </div>
  );
}

function getWidthClass(width: FormField["width"]): string {
  switch (width) {
    case "half":
      return "lub-form__field--half";
    case "third":
      return "lub-form__field--third";
    case "quarter":
      return "lub-form__field--quarter";
    case "full":
    default:
      return "lub-form__field--full";
  }
}

// Group fields for two-column layout respecting width settings
function groupFieldsForTwoColumn(fields: FormField[]): FormField[][] {
  const groups: FormField[][] = [];
  let currentRow: FormField[] = [];
  let currentRowWidth = 0;

  for (const field of fields) {
    const fieldWidth = getFieldWidthValue(field.width);

    // Full-width fields always go on their own row
    if (fieldWidth >= 1) {
      if (currentRow.length > 0) {
        groups.push(currentRow);
        currentRow = [];
        currentRowWidth = 0;
      }
      groups.push([field]);
      continue;
    }

    // Check if field fits in current row
    if (currentRowWidth + fieldWidth > 1) {
      groups.push(currentRow);
      currentRow = [field];
      currentRowWidth = fieldWidth;
    } else {
      currentRow.push(field);
      currentRowWidth += fieldWidth;
    }
  }

  // Push remaining fields
  if (currentRow.length > 0) {
    groups.push(currentRow);
  }

  return groups;
}

function getFieldWidthValue(width: FormField["width"]): number {
  switch (width) {
    case "quarter":
      return 0.25;
    case "third":
      return 0.333;
    case "half":
      return 0.5;
    case "full":
    default:
      return 1;
  }
}
