/**
 * UMD/IIFE entry point for script tag embedding
 *
 * Usage:
 *
 * <!-- Auto-mount via data attributes -->
 * <script src="https://forms.lub.com/v1/lub-forms.standalone.js"></script>
 * <link rel="stylesheet" href="https://forms.lub.com/v1/lub-forms.css">
 * <div data-lub-form-id="abc123" data-lub-base-url="https://api.lub.com"></div>
 *
 * <!-- Manual render -->
 * <script>
 *   LubForms.render('abc123', 'container-id', {
 *     baseUrl: 'https://api.lub.com',
 *     onSuccess: (data) => console.log('Success!', data),
 *     onError: (err) => console.error('Error:', err),
 *   });
 * </script>
 */

import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LubForm, type LubFormProps } from "./core/LubForm";
import type { SubmitFormResponse, ApiError, FormDesign } from "./api/types";

// Import styles for standalone bundle
import "./styles/index.css";

// Store roots for cleanup
const roots = new Map<string, Root>();

// Render options type
interface RenderOptions {
  baseUrl?: string;
  onSuccess?: (data: SubmitFormResponse) => void;
  onError?: (error: ApiError) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  onStepChange?: (step: number, total: number) => void;
  className?: string;
  designOverrides?: Partial<FormDesign>;
}

/**
 * Render a form into a container element
 */
function render(
  formId: string,
  containerOrId: string | HTMLElement,
  options: RenderOptions = {},
): { unmount: () => void } {
  const container =
    typeof containerOrId === "string"
      ? document.getElementById(containerOrId)
      : containerOrId;

  if (!container) {
    console.error(`[LubForms] Container not found: ${containerOrId}`);
    return { unmount: () => {} };
  }

  // Unmount existing root if present
  const existingRoot = roots.get(container.id || formId);
  if (existingRoot) {
    existingRoot.unmount();
    roots.delete(container.id || formId);
  }

  // Create new root and render
  const root = createRoot(container);
  roots.set(container.id || formId, root);

  const props: LubFormProps = {
    formId,
    baseUrl: options.baseUrl || "",
    onSuccess: options.onSuccess,
    onError: options.onError,
    onValidationError: options.onValidationError,
    onStepChange: options.onStepChange,
    className: options.className,
    designOverrides: options.designOverrides,
  };

  root.render(createElement(LubForm, props));

  return {
    unmount: () => {
      root.unmount();
      roots.delete(container.id || formId);
    },
  };
}

/**
 * Auto-mount forms from data attributes
 */
function autoMount(): void {
  const containers =
    document.querySelectorAll<HTMLElement>("[data-lub-form-id]");

  containers.forEach((container) => {
    const formId = container.dataset.lubFormId;
    if (!formId) return;

    // Skip if already mounted
    if (container.dataset.lubMounted === "true") return;

    const options: RenderOptions = {
      baseUrl: container.dataset.lubBaseUrl || "",
      className: container.dataset.lubClass,
    };

    // Handle callbacks via global functions
    const onSuccessName = container.dataset.lubOnSuccess;
    if (
      onSuccessName &&
      typeof window[onSuccessName as keyof Window] === "function"
    ) {
      options.onSuccess = window[onSuccessName as keyof Window] as (
        data: SubmitFormResponse,
      ) => void;
    }

    const onErrorName = container.dataset.lubOnError;
    if (
      onErrorName &&
      typeof window[onErrorName as keyof Window] === "function"
    ) {
      options.onError = window[onErrorName as keyof Window] as (
        error: ApiError,
      ) => void;
    }

    render(formId, container, options);
    container.dataset.lubMounted = "true";
  });
}

/**
 * Unmount a form by container ID
 */
function unmount(containerId: string): void {
  const root = roots.get(containerId);
  if (root) {
    root.unmount();
    roots.delete(containerId);
  }
}

/**
 * Unmount all forms
 */
function unmountAll(): void {
  roots.forEach((root) => root.unmount());
  roots.clear();
}

/**
 * Initialize LubForms (call autoMount on DOM ready)
 */
function init(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
}

// Export for UMD/global
const LubForms = {
  render,
  autoMount,
  unmount,
  unmountAll,
  init,
  // Re-export main component for advanced usage
  LubForm,
};

// Auto-initialize when script loads
init();

// Expose on window for UMD
if (typeof window !== "undefined") {
  (window as unknown as { LubForms: typeof LubForms }).LubForms = LubForms;
}

export default LubForms;
export { render, autoMount, unmount, unmountAll, init, LubForm };
