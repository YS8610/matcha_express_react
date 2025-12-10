import { useState, useCallback } from 'react';

export function useFormState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const startLoading = useCallback(() => {
    setLoading(true);
    setError('');
    setSuccess('');
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setErrorMessage = useCallback((message: string) => {
    setError(message);
    setLoading(false);
  }, []);

  const setSuccessMessage = useCallback((message: string) => {
    setSuccess(message);
    setError('');
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError('');
    setSuccess('');
  }, []);

  return {
    loading,
    error,
    success,
    setLoading,
    startLoading,
    stopLoading,
    setError: setErrorMessage,
    setSuccess: setSuccessMessage,
    reset,
  };
}
