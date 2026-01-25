import { useEffect, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { FormField } from "@/api/types";
import { useLubFormContext } from "@/core/FormProvider";

interface RecaptchaFieldProps {
  field: FormField;
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

export function RecaptchaField({ field }: RecaptchaFieldProps) {
  const { setValue, setError, clearErrors } = useFormContext();
  const { form } = useLubFormContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const scriptLoadedRef = useRef(false);

  const siteKey = form.settings.recaptcha_site_key;

  // Callback for v2 checkbox
  const handleV2Callback = useCallback(
    (token: string) => {
      setValue("_recaptcha_token", token);
      clearErrors("_recaptcha_token");
    },
    [setValue, clearErrors],
  );

  const handleExpired = useCallback(() => {
    setValue("_recaptcha_token", "");
    setError("_recaptcha_token", {
      type: "manual",
      message: "reCAPTCHA expired, please try again",
    });
  }, [setValue, setError]);

  // Load reCAPTCHA script
  useEffect(() => {
    if (!siteKey || scriptLoadedRef.current) return;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      scriptLoadedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup as it might be used elsewhere
    };
  }, [siteKey]);

  // Render v2 widget
  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const renderWidget = () => {
      if (
        window.grecaptcha &&
        containerRef.current &&
        widgetIdRef.current === null
      ) {
        window.grecaptcha.ready(() => {
          if (containerRef.current) {
            widgetIdRef.current = window.grecaptcha!.render(
              containerRef.current,
              {
                sitekey: siteKey,
                callback: handleV2Callback,
                "expired-callback": handleExpired,
                "error-callback": handleExpired,
              },
            );
          }
        });
      }
    };

    // Try rendering, with retry if script isn't loaded yet
    const attemptRender = () => {
      if (window.grecaptcha) {
        renderWidget();
      } else {
        setTimeout(attemptRender, 100);
      }
    };

    attemptRender();

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, handleV2Callback, handleExpired]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="lub-form__recaptcha">
      <div ref={containerRef} className="lub-form__recaptcha-widget" />
    </div>
  );
}
