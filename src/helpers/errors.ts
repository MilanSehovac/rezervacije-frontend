import { isAxiosError } from "axios";

/** Message from the API ({ error }) when there is one, otherwise the fallback. */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const apiMessage = (error.response?.data as { error?: string } | undefined)?.error;
    if (apiMessage) return apiMessage;
  }
  return fallback;
};
