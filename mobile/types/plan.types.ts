export interface CreatePlanPayload {
  location: string;
  budget: number;
  activityType: string;
}

export interface PlanActivity {
  activity_id?: number;
  id?: number | string;
  plan_id?: number;
  activity_name: string;
  place_name?: string;
  start_time?: string;
  estimated_cost?: number;
  duration_minutes?: number;
  indoor_outdoor?: string;
  description?: string;
}

export interface BackupActivity {
  activity_name: string;
  place_name?: string;
  reason?: string;
}

export interface Plan {
  plan_id: number;
  user_id?: string | number | null;
  title: string;
  location: string;
  budget: number;
  theme: string;
  date_created?: string;
  event_date?: string | null;
  weather_summary?: string | null;
}

export interface GeneratedItinerary {
  title?: string;
  totalEstimatedCost?: number;
  activities?: PlanActivity[];
  backup_activity?: BackupActivity;
  weather_note?: string;
  route_context?: RouteContext;
  validation?: PlanValidation;
}

export interface RouteContext {
  provider: string;
  profile: string;
  distanceMeters: number;
  durationSeconds: number;
  stopCount: number;
}

export interface PlanValidation {
  budget?: {
    status: string;
    budget: number;
    estimatedCost: number;
    remaining: number;
    withinBudget: boolean;
  };
  weather?: {
    status: string;
    description: string;
    temperature: number | null;
    outdoorActivities: number;
    warning: string | null;
  };
}

export interface CreatePlanResponse {
  success: boolean;
  plan?: Plan;
  itinerary?: GeneratedItinerary;
  activities?: PlanActivity[];
  error?: string;
  message?: string;
}

export interface CreatePlanResult {
  plan: Plan;
  itinerary?: GeneratedItinerary;
  activities: PlanActivity[];
}
