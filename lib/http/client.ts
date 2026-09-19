import { toastMiddleware } from './toast-middleware';

export type ToastMessage = {
  title: string;
  description?: string;
};

export type HttpRequestOptions = RequestInit & {
  /** Show a success toast after a successful request. Defaults to false. */
  successToast?: ToastMessage | false;
  /** Show an error toast after a failed request. Defaults to true. */
  errorToast?: ToastMessage | false;
};

export type HttpRequestContext = {
  input: RequestInfo | URL;
  options: HttpRequestOptions;
  response?: Response;
};

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export type HttpMiddleware = {
  onSuccess?: (context: HttpRequestContext) => void;
  onError?: (error: unknown, context: HttpRequestContext) => void;
};

const getErrorMessage = (data: unknown, fallback: string) => {
  if (typeof data === 'object' && data !== null && 'error' in data) {
    const error = data.error;
    if (typeof error === 'string') return error;
  }
  return fallback;
};

async function readResponse(response: Response) {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export function createHttpClient(middleware: HttpMiddleware[] = []) {
  return {
    async request<T>(input: RequestInfo | URL, options: HttpRequestOptions = {}): Promise<T> {
      const context: HttpRequestContext = { input, options };
      const { successToast: _successToast, errorToast: _errorToast, ...requestInit } = options;
      let response: Response;

      try {
        response = await fetch(input, requestInit);
      } catch (error) {
        middleware.forEach((item) => item.onError?.(error, context));
        throw error;
      }

      context.response = response;
      const data = await readResponse(response);

      if (!response.ok) {
        const error = new HttpError(
          getErrorMessage(data, `Request failed with status ${response.status}`),
          response.status,
          data,
        );
        middleware.forEach((item) => item.onError?.(error, context));
        throw error;
      }

      middleware.forEach((item) => item.onSuccess?.(context));
      return data as T;
    },
  };
}

export const httpClient = createHttpClient();

/** Shared browser client. Add request-specific toast options at the call site. */
export const httpClientWithToast = createHttpClient([toastMiddleware]);
