import type {
  PublicFormResponse,
  SubmitFormRequest,
  SubmitFormResponse,
  ApiError,
} from "./types";

export class LubFormsClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    // Remove trailing slash
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  /**
   * Fetch a form by ID for public display
   */
  async getForm(formId: string): Promise<PublicFormResponse> {
    const url = `${this.baseUrl}/public/forms/${formId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw error;
    }

    return response.json() as Promise<PublicFormResponse>;
  }

  /**
   * Submit form data
   */
  async submitForm(
    formId: string,
    data: SubmitFormRequest,
  ): Promise<SubmitFormResponse> {
    const url = `${this.baseUrl}/public/forms/${formId}/submit`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw error;
    }

    return response.json() as Promise<SubmitFormResponse>;
  }

  /**
   * Confirm double opt-in
   */
  async confirmOptIn(
    token: string,
  ): Promise<{ success: boolean; message: string; submission_id: string }> {
    const url = `${this.baseUrl}/public/forms/confirm/${token}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw error;
    }

    return response.json();
  }

  private async parseError(response: Response): Promise<ApiError> {
    try {
      const data = await response.json();
      return {
        error: data.error || data.message || "An error occurred",
        code: data.code,
        details: data.details,
      };
    } catch {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  }
}

// Default client instance (can be set via LubForms.init)
let defaultClient: LubFormsClient | null = null;

export function setDefaultClient(client: LubFormsClient): void {
  defaultClient = client;
}

export function getDefaultClient(): LubFormsClient | null {
  return defaultClient;
}

export function createClient(baseUrl: string): LubFormsClient {
  return new LubFormsClient(baseUrl);
}
