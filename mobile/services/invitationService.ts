import axios from 'axios';

import { api } from '@/config/api';
import type {
  InvitationCreateResponse,
  InvitationSendResponse,
} from '@/types/phase3.types';

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Hindi muna maipadala ang invitation. Subukan ulit.'
    );
  }

  return error instanceof Error
    ? error.message
    : 'Hindi muna maipadala ang invitation. Subukan ulit.';
}

export const invitationService = {
  createPreview: async (planId: number): Promise<string> => {
    try {
      const { data } = await axios.post<InvitationCreateResponse>(
        api.invitation.create,
        { planId },
      );

      if (!data.success || !data.message) {
        throw new Error(data.error || 'Walang invitation message na nakuha.');
      }

      return data.message;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  send: async (
    planId: number,
    receiverEmail: string,
    message: string,
  ): Promise<void> => {
    try {
      const { data } = await axios.post<InvitationSendResponse>(
        api.invitation.send,
        { planId, receiverEmail, message },
      );

      if (!data.success) {
        throw new Error(data.error || 'Hindi nakumpirma ang pagpapadala.');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
