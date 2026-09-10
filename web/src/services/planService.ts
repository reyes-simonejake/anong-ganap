import axios from 'axios';

import { api } from '@/config/api';
import type { Plan } from '@/types/plan';

interface PlansResponse {
  success: boolean;
  plans?: Plan[];
  error?: string;
}

export const planService = {
  getAll: async (): Promise<Plan[]> => {
    const { data } = await axios.get<PlansResponse>(api.plan.getAll);
    if (!data.success) throw new Error(data.error || 'Failed to load plans.');
    return data.plans ?? [];
  },
};
