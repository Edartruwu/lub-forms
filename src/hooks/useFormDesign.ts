import { useMemo, type CSSProperties } from "react";
import type { FormDesign } from "@/api/types";
import { formDesignToCssVariables } from "@/utils/css-variables";

interface UseFormDesignOptions {
  design: FormDesign;
  overrides?: Partial<FormDesign>;
}

interface UseFormDesignReturn {
  mergedDesign: FormDesign;
  cssVariables: Record<string, string>;
  style: CSSProperties;
  theme: string;
}

export function useFormDesign({
  design,
  overrides,
}: UseFormDesignOptions): UseFormDesignReturn {
  const mergedDesign = useMemo(
    (): FormDesign => ({
      ...design,
      ...overrides,
      button_style: {
        ...design.button_style,
        ...overrides?.button_style,
      },
    }),
    [design, overrides],
  );

  const cssVariables = useMemo(
    () => formDesignToCssVariables(mergedDesign),
    [mergedDesign],
  );

  const style = useMemo(() => cssVariables as CSSProperties, [cssVariables]);

  const theme = mergedDesign.theme || "light";

  return {
    mergedDesign,
    cssVariables,
    style,
    theme,
  };
}
