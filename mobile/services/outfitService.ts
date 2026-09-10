import axios from 'axios';

import { api } from '@/config/api';
import type {
  OutfitPerson,
  OutfitResponse,
  OutfitSuggestion,
} from '@/types/phase3.types';

function parsePerson(value: OutfitPerson | string | undefined): OutfitPerson | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as OutfitPerson;
    } catch {
      return undefined;
    }
  }

  return value;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Hindi muna makakuha ng outfit suggestion. Subukan ulit.'
    );
  }

  return error instanceof Error
    ? error.message
    : 'Hindi muna makakuha ng outfit suggestion. Subukan ulit.';
}

export const outfitService = {
  generate: async (
    planId: number,
    location: string,
    activityType: string,
  ): Promise<OutfitSuggestion> => {
    try {
      const { data } = await axios.post<OutfitResponse>(api.outfit.generate, {
        planId,
        location,
        activityType,
      });

      const suggestions = data.suggestions || {};
      const savedOutfit = data.outfit;

      return {
        ...suggestions,
        theme: suggestions.theme || savedOutfit?.theme,
        personA:
          suggestions.personA || parsePerson(savedOutfit?.person_a_outfit),
        personB:
          suggestions.personB || parsePerson(savedOutfit?.person_b_outfit),
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
