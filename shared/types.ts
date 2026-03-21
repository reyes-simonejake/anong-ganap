// Shared TypeScript types for frontend and backend

export interface Plan {
  plan_id: number;
  user_id: number;
  title: string;
  location: string;
  budget: number;
  theme: string;
  date_created: string;
  weather_summary: string;
}

export interface Activity {
  activity_id: number;
  plan_id: number;
  activity_name: string;
  place_name: string;
  latitude: number;
  longitude: number;
  start_time: string;
  estimated_cost: number;
  indoor_outdoor: 'indoor' | 'outdoor';
}

export interface Outfit {
  outfit_id: number;
  plan_id: number;
  theme: string;
  person_a_outfit: string;
  person_b_outfit: string;
  weather_adjusted: boolean;
}

export interface Invitation {
  invitation_id: number;
  plan_id: number;
  receiver_email: string;
  invitation_message: string;
  sent_status: 'pending' | 'sent' | 'failed';
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

export type ActivityType = 'date' | 'hangout' | 'family' | 'solo';
export type TransportPreference = 'public' | 'private' | 'walking';
