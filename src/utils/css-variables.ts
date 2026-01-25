import type { FormDesign } from "@/api/types";

/**
 * Convert FormDesign to CSS custom properties
 */
export function formDesignToCssVariables(
  design: FormDesign,
): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  if (design.background_color) {
    vars["--lub-bg-color"] = design.background_color;
  }
  if (design.text_color) {
    vars["--lub-text-color"] = design.text_color;
  }
  if (design.primary_color) {
    vars["--lub-primary-color"] = design.primary_color;
  }
  if (design.border_color) {
    vars["--lub-border-color"] = design.border_color;
  }

  // Typography
  if (design.font_family) {
    vars["--lub-font-family"] = design.font_family;
  }
  if (design.font_size) {
    vars["--lub-font-size"] = design.font_size;
  }

  // Spacing
  if (design.padding) {
    vars["--lub-padding"] = design.padding;
  }
  if (design.field_spacing) {
    vars["--lub-field-spacing"] = design.field_spacing;
  }

  // Button styling
  if (design.button_style) {
    if (design.button_style.background_color) {
      vars["--lub-btn-bg"] = design.button_style.background_color;
    }
    if (design.button_style.text_color) {
      vars["--lub-btn-text"] = design.button_style.text_color;
    }
    if (design.button_style.border_radius) {
      vars["--lub-btn-radius"] = design.button_style.border_radius;
    }
  }

  return vars;
}

/**
 * Apply CSS variables to an element's style
 */
export function applyCssVariables(design: FormDesign): React.CSSProperties {
  const vars = formDesignToCssVariables(design);
  return vars as React.CSSProperties;
}
