// Shared TypeScript types for frontend and backend.
// These mirror backend/supabase-schema.sql.

export type UUID = string;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export type ActivityType = 'date' | 'hangout' | 'family' | 'solo';
export type PlanStatus = 'draft' | 'sent' | 'finalized';
export type IndoorOutdoor = 'indoor' | 'outdoor';
export type InvitationStatus = 'pending' | 'sent' | 'failed';
export type ProposalType = 'activity' | 'outfit' | 'timing';
export type ProposalStatus = 'pending' | 'accepted' | 'rejected';
export type VoteValue = 'up' | 'down';
export type TransportPreference = 'public' | 'private' | 'walking';

export interface Profile {
  user_id: UUID;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Plan {
  plan_id: number;
  user_id: UUID | null;
  title: string;
  location: string;
  budget: number;
  theme: ActivityType;
  date_created: string;
  event_date: string | null;
  weather_summary: string | null;
  collaboration_enabled: boolean;
  status: PlanStatus;
}

export interface Activity {
  activity_id: number;
  plan_id: number;
  activity_name: string;
  place_name: string | null;
  start_time: string | null;
  duration_minutes: number | null;
  estimated_cost: number | null;
  indoor_outdoor: IndoorOutdoor;
  description: string | null;
  is_backup: boolean;
  sequence_order: number;
}

export interface Outfit {
  outfit_id: number;
  plan_id: number;
  theme: ActivityType | null;
  person_a_outfit: JsonObject | null;
  person_b_outfit: JsonObject | null;
  weather_adjusted: boolean;
  pinterest_search_query: string | null;
  created_at: string;
}

export interface Invitation {
  invitation_id: number;
  plan_id: number;
  receiver_email: string;
  invitation_message: string | null;
  sent_status: InvitationStatus;
  invite_token: UUID;
  created_at: string;
  responded_at: string | null;
}

export interface Proposal {
  proposal_id: number;
  plan_id: number;
  invitation_id: number | null;
  proposal_type: ProposalType;
  proposed_value: JsonObject;
  reason: string | null;
  status: ProposalStatus;
  vote_count: number;
  created_at: string;
}

export interface Vote {
  vote_id: number;
  proposal_id: number;
  voter_email: string;
  vote: VoteValue;
  created_at: string;
}

export interface Feedback {
  feedback_id: number;
  plan_id: number;
  activity_rating: number | null;
  outfit_rating: number | null;
  weather_accuracy: number | null;
  notes: string | null;
  photo_urls: string[] | null;
  created_at: string;
}

export interface PlanWithActivities {
  plan: Plan;
  activities: Activity[];
}

export interface Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface Place {
  name: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
}
