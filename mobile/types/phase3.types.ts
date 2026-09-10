export interface OutfitPerson {
  top?: string;
  bottom?: string;
  shoes?: string;
  accessories?: string;
  colorPalette?: string[];
}

export interface OutfitSuggestion {
  theme?: string;
  weatherNote?: string;
  pinterestSearchQuery?: string;
  personA?: OutfitPerson;
  personB?: OutfitPerson;
}

export interface OutfitResponse {
  success: boolean;
  outfit?: {
    theme?: string;
    person_a_outfit?: OutfitPerson | string;
    person_b_outfit?: OutfitPerson | string;
  };
  suggestions?: OutfitSuggestion;
  error?: string;
  message?: string;
}

export interface InvitationCreateResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface InvitationSendResponse {
  success: boolean;
  invitation?: {
    invitation_id?: number;
    receiver_email?: string;
    sent_status?: string;
  };
  error?: string;
  message?: string;
}
