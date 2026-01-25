# @lub/forms

Embeddable form library for Lub CRM. Render dynamic forms that integrate with Lub CRM for lead capture and data collection.

## Features

- Multiple deployment options: React component, UMD script, or standalone bundle
- Multi-step form support with progress indicators
- Conditional field visibility and requirements
- Dynamic validation with Zod schemas
- CRM field mapping for automatic lead creation
- UTM parameter tracking
- Customizable styling via CSS variables
- 17+ field types including country/state selectors

## Installation

### NPM Package (React Apps)

```bash
npm install @lub/forms
# or
bun add @lub/forms
```

### Script Tag (Standalone)

No build step required. Includes React and all dependencies:

```html
<script src="https://forms.lub.com/v1/lub-forms.standalone.js"></script>
```

### Script Tag (UMD)

For pages that already have React loaded:

```html
<script src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
<script src="https://forms.lub.com/v1/lub-forms.umd.js"></script>
<link rel="stylesheet" href="https://forms.lub.com/v1/lub-forms.css" />
```

## Usage

### React Component

```tsx
import { LubForm } from "@lub/forms";
import "@lub/forms/styles";

function ContactPage() {
  return (
    <LubForm
      formId="abc123"
      baseUrl="https://api.lub.com"
      onSuccess={(data) => {
        console.log("Submission ID:", data.submission_id);
        window.location.href = "/thank-you";
      }}
      onError={(error) => {
        console.error("Submission failed:", error.message);
      }}
    />
  );
}
```

### Script Tag (Auto-mount)

Forms automatically mount to elements with `data-lub-form-id`:

```html
<div
  data-lub-form-id="abc123"
  data-lub-base-url="https://api.lub.com"
  data-lub-class="my-custom-class"
  data-lub-on-success="handleSuccess"
  data-lub-on-error="handleError"
></div>

<script>
  function handleSuccess(data) {
    window.location.href = "/thank-you";
  }
  function handleError(error) {
    alert("Something went wrong");
  }
</script>
```

### Script Tag (Manual Render)

```html
<div id="my-form"></div>

<script>
  LubForms.render("abc123", "my-form", {
    baseUrl: "https://api.lub.com",
    onSuccess: (data) => {
      console.log("Success!", data);
    },
    onError: (err) => {
      console.error("Error:", err);
    },
    designOverrides: {
      primary_color: "#8b5cf6",
    },
  });
</script>
```

## Props / Options

| Prop                | Type                                       | Description                                 |
| ------------------- | ------------------------------------------ | ------------------------------------------- |
| `formId`            | `string`                                   | Form ID from Lub CRM (required)             |
| `baseUrl`           | `string`                                   | API base URL                                |
| `onSuccess`         | `(data: SubmitFormResponse) => void`       | Called on successful submission             |
| `onError`           | `(error: ApiError) => void`                | Called on submission error                  |
| `onValidationError` | `(errors: Record<string, string>) => void` | Called when validation fails                |
| `onStepChange`      | `(step: number, total: number) => void`    | Called when multi-step form changes step    |
| `className`         | `string`                                   | Additional CSS class for the form container |
| `style`             | `CSSProperties`                            | Inline styles                               |
| `designOverrides`   | `Partial<FormDesign>`                      | Override form design settings               |

## Field Types

| Type             | Description                 |
| ---------------- | --------------------------- |
| `text`           | Single-line text input      |
| `textarea`       | Multi-line text input       |
| `email`          | Email input with validation |
| `phone`          | Phone number input          |
| `number`         | Numeric input with min/max  |
| `url`            | URL input with validation   |
| `date`           | Date picker                 |
| `time`           | Time picker                 |
| `datetime`       | Date and time picker        |
| `select`         | Dropdown select             |
| `radio`          | Radio button group          |
| `checkbox`       | Single checkbox             |
| `checkbox_group` | Multiple checkboxes         |
| `file`           | File upload                 |
| `hidden`         | Hidden field                |
| `country`        | Country selector            |
| `state`          | State/province selector     |
| `html`           | Static HTML content         |
| `divider`        | Visual divider              |
| `recaptcha`      | reCAPTCHA v2/v3             |

## Styling

Forms are styled using CSS variables. Override them via `designOverrides` or CSS:

```css
.lub-form {
  --lub-primary-color: #3b82f6;
  --lub-background-color: #ffffff;
  --lub-text-color: #1f2937;
  --lub-border-color: #e5e7eb;
  --lub-font-family: system-ui, sans-serif;
  --lub-font-size: 14px;
  --lub-padding: 24px;
  --lub-field-spacing: 16px;
}
```

Or via JavaScript:

```jsx
<LubForm
  formId="abc123"
  designOverrides={{
    primary_color: "#8b5cf6",
    background_color: "#fafafa",
    font_family: "Inter, sans-serif",
    button_style: {
      border_radius: "9999px",
      full_width: true,
    },
  }}
/>
```

## Conditional Logic

Fields support conditional visibility and requirements based on other field values:

```typescript
// Show field when another field equals a value
conditional_logic: {
  show_if: {
    field_name: 'interest',
    operator: 'equals',
    value: 'other'
  }
}

// Make field required based on condition
conditional_logic: {
  required_if: {
    field_name: 'newsletter',
    operator: 'equals',
    value: true
  }
}
```

**Operators:** `equals`, `not_equals`, `contains`, `not_contains`, `greater_than`, `less_than`, `is_empty`, `is_not_empty`

## Custom Field Components

Register custom field types for advanced use cases:

```tsx
import { registerFieldComponent } from "@lub/forms";

registerFieldComponent("rating", ({ field, register, error }) => (
  <div className="rating-field">
    {[1, 2, 3, 4, 5].map((value) => (
      <label key={value}>
        <input type="radio" value={value} {...register(field.name)} />
        {"⭐".repeat(value)}
      </label>
    ))}
    {error && <span className="error">{error}</span>}
  </div>
));
```

## API Client

Use the client directly for custom integrations:

```tsx
import { LubFormsClient } from "@lub/forms";

const client = new LubFormsClient("https://api.lub.com");

// Fetch form definition
const form = await client.getForm("abc123");

// Submit form data
const response = await client.submitForm("abc123", {
  data: { email: "user@example.com", name: "John" },
  utm_parameters: { source: "landing-page" },
  referrer: window.location.href,
});

// Confirm double opt-in
const confirmation = await client.confirmOptIn("token123");
```

## Global API (Script Tag)

When using the standalone or UMD build:

```javascript
// Render a form
LubForms.render(formId, containerIdOrElement, options);

// Auto-mount all forms with data-lub-form-id
LubForms.autoMount();

// Unmount a specific form
LubForms.unmount(containerId);

// Unmount all forms
LubForms.unmountAll();

// Initialize (called automatically)
LubForms.init();
```

## Development

```bash
bun install
bun run dev          # Start dev server on :5174
bun run build        # Build all formats
bun run lint         # Run ESLint
bun run typecheck    # TypeScript check
```

## Build Outputs

| File                           | Format | Use Case                       |
| ------------------------------ | ------ | ------------------------------ |
| `dist/lub-forms.es.js`         | ESM    | NPM package for React apps     |
| `dist/lub-forms.umd.js`        | UMD    | Script tag with React on page  |
| `dist/lub-forms.standalone.js` | IIFE   | Drop-in script, bundles React  |
| `dist/lub-forms.css`           | CSS    | Shared styles (UMD/ESM builds) |

## License

MIT
