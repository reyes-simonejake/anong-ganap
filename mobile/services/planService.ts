import axios from 'axios';

import { api } from '@/config/api';
import type {
  CreatePlanPayload,
  CreatePlanResponse,
  CreatePlanResult,
} from '@/types/plan.types';

interface ApiErrorBody {
  error?: string;
  message?: string;
}

function getCreatePlanErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Hindi muna makagawa ng plan. Check mo kung running ang backend.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Hindi muna makagawa ng plan. Subukan ulit mamaya.';
}

export const planService = {
  create: async (payload: CreatePlanPayload): Promise<CreatePlanResult> => {
    try {
      const { data } = await axios.post<CreatePlanResponse>(
        api.plan.create,
        payload,
      );

      if (!data.success || !data.plan) {
        throw new Error(
          data.error ||
            data.message ||
            'Hindi muna kumpleto ang plan response ng backend.',
        );
      }

      return {
        plan: data.plan,
        itinerary: data.itinerary,
        activities: data.activities ?? data.itinerary?.activities ?? [],
      };
    } catch (error) {
      throw new Error(getCreatePlanErrorMessage(error));
    }
  },
  getById: async (planId: number): Promise<CreatePlanResult> => {
    try {
      const { data } = await axios.get<CreatePlanResponse>(api.plan.getOne(planId));

      if (!data.success || !data.plan) {
        throw new Error(data.error || 'Hindi mahanap ang saved plan.');
      }

      return {
        plan: data.plan,
        activities: data.activities ?? [],
      };
    } catch (error) {
      throw new Error(getCreatePlanErrorMessage(error));
    }
  },
};
