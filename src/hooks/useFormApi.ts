import { useState, useCallback } from "react";
import type {
  PublicFormResponse,
  SubmitFormRequest,
  SubmitFormResponse,
  ApiError,
} from "@/api/types";
import { LubFormsClient } from "@/api/client";

interface UseFormApiOptions {
  baseUrl: string;
  formId: string;
}

interface UseFormApiReturn {
  form: PublicFormResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: ApiError | null;
  submitResponse: SubmitFormResponse | null;
  fetchForm: () => Promise<void>;
  submitForm: (data: Record<string, unknown>) => Promise<SubmitFormResponse>;
  reset: () => void;
}

export function useFormApi({
  baseUrl,
  formId,
}: UseFormApiOptions): UseFormApiReturn {
  const [form, setForm] = useState<PublicFormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [submitResponse, setSubmitResponse] =
    useState<SubmitFormResponse | null>(null);

  const client = new LubFormsClient(baseUrl);

  const fetchForm = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await client.getForm(formId);
      setForm(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, [formId, baseUrl]);

  const submitForm = useCallback(
    async (data: Record<string, unknown>): Promise<SubmitFormResponse> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const request: SubmitFormRequest = {
          data,
          referrer: typeof window !== "undefined" ? window.location.href : "",
          utm_parameters: getUTMParameters(),
        };

        const response = await client.submitForm(formId, request);
        setSubmitResponse(response);
        return response;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        throw apiError;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formId, baseUrl],
  );

  const reset = useCallback(() => {
    setError(null);
    setSubmitResponse(null);
  }, []);

  return {
    form,
    isLoading,
    isSubmitting,
    error,
    submitResponse,
    fetchForm,
    submitForm,
    reset,
  };
}

function getUTMParameters() {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  const utmParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];

  for (const param of utmParams) {
    const value = params.get(param);
    if (value) {
      utm[param.replace("utm_", "")] = value;
    }
  }

  return Object.keys(utm).length > 0 ? utm : undefined;
}
