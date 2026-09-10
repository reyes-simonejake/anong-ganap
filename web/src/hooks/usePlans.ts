import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { planService } from '@/services/planService';
import type { Plan } from '@/types/plan';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      setPlans(await planService.getAll());
    } catch (error) {
      const apiMessage = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : null;
      setErrorMessage(apiMessage || 'Check that the backend and Supabase are available, then retry.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadPlans(); }, [loadPlans]);

  return { plans, isLoading, errorMessage, reload: loadPlans };
}
