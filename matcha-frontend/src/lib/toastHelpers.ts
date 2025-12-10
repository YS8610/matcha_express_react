type ToastType = 'success' | 'error' | 'warning' | 'info';
type AddToastFunction = (message: string, type: ToastType, duration?: number) => void;

export function showSuccessToast(message: string, addToast: AddToastFunction, duration = 3000): void {
  addToast(message, 'success', duration);
}

export function showErrorToast(message: string, addToast: AddToastFunction, duration = 4000): void {
  addToast(message, 'error', duration);
}

export function showWarningToast(message: string, addToast: AddToastFunction, duration = 3000): void {
  addToast(message, 'warning', duration);
}

export function showInfoToast(message: string, addToast: AddToastFunction, duration = 3000): void {
  addToast(message, 'info', duration);
}

export function showApiError(
  error: unknown,
  addToast: AddToastFunction,
  fallbackMessage = 'An error occurred',
  duration = 4000
): void {
  let errorMessage = fallbackMessage;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String(error.message);
  }

  addToast(errorMessage, 'error', duration);
}
