import { requireSupabase } from '../config/supabase.js';
import { generateItinerary } from './aiService.js';
import { getWeatherData } from './weatherService.js';
import { fetchNearbyPlaces } from './placesService.js';
import { getRouteContext } from './routeService.js';

const VALID_ACTIVITY_TYPES = new Set(['date', 'hangout', 'family', 'solo']);
const VALID_LOCATION_TYPES = new Set(['indoor', 'outdoor']);
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

const createHttpError = (message, status = 400) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const getDatabaseClient = () => {
    // Phase 1 keeps Supabase as the only plan store; missing DB config is an explicit 503.
    return requireSupabase();
};

const normalizeBudget = (budget) => {
    const normalizedBudget = Number(budget);

    if (!Number.isFinite(normalizedBudget) || normalizedBudget < 0) {
        throw createHttpError('Budget must be a valid non-negative number');
    }

    return normalizedBudget;
};

const normalizeEventDate = (date) => {
    if (date === undefined || date === null || date === '') {
        return null;
    }

    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        throw createHttpError('Date must be a valid date');
    }

    return parsedDate.toISOString().slice(0, 10);
};

const normalizePositiveNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const normalizedValue = Number(value);
    return Number.isFinite(normalizedValue) && normalizedValue > 0
        ? normalizedValue
        : null;
};

const normalizeNonNegativeNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const normalizedValue = Number(value);
    return Number.isFinite(normalizedValue) && normalizedValue >= 0
        ? normalizedValue
        : null;
};

const normalizeStartTime = (startTime) => {
    if (typeof startTime !== 'string') {
        return null;
    }

    const trimmedTime = startTime.trim();
    return TIME_PATTERN.test(trimmedTime) ? trimmedTime : null;
};

const normalizeIndoorOutdoor = (indoorOutdoor) => {
    return VALID_LOCATION_TYPES.has(indoorOutdoor) ? indoorOutdoor : 'outdoor';
};

const getEstimatedCost = (activity) =>
    normalizeNonNegativeNumber(activity?.estimated_cost) || 0;

const buildValidationMetadata = (activities, budget, weather) => {
    const estimatedCost = activities.reduce(
        (total, activity) => total + getEstimatedCost(activity),
        0
    );
    const weatherDescription = weather?.description || 'unknown';
    const isRainy = /rain|storm|thunder|drizzle/i.test(weatherDescription);
    const outdoorActivities = activities.filter(
        (activity) => normalizeIndoorOutdoor(activity.indoor_outdoor) === 'outdoor'
    ).length;
    const weatherWarning = isRainy && outdoorActivities > 0
        ? `${outdoorActivities} outdoor activit${outdoorActivities === 1 ? 'y' : 'ies'} may need an indoor backup.`
        : null;

    return {
        budget: {
            status: estimatedCost <= budget ? 'pass' : 'warning',
            budget,
            estimatedCost,
            remaining: budget - estimatedCost,
            withinBudget: estimatedCost <= budget,
        },
        weather: {
            status: weatherWarning ? 'warning' : 'pass',
            description: weatherDescription,
            temperature: weather?.temperature ?? null,
            outdoorActivities,
            warning: weatherWarning,
        },
    };
};

const applyWeatherRules = (activities, weather) => {
    const weatherDescription = weather?.description || '';
    const isRainy = /rain|storm|thunder|drizzle/i.test(weatherDescription);

    if (!isRainy) {
        return activities;
    }

    return activities.map((activity) => {
        if (normalizeIndoorOutdoor(activity.indoor_outdoor) !== 'outdoor') {
            return activity;
        }

        return {
            ...activity,
            indoor_outdoor: 'indoor',
            description: `${activity.description || 'Planned activity.'} Indoor backup recommended because rain is expected.`,
        };
    });
};

const normalizeActivity = (activity, planId, sequenceOrder, isBackup = false) => {
    const activityName = activity?.activity_name || activity?.name;

    if (!activityName) {
        throw createHttpError('Generated itinerary is missing an activity name', 502);
    }

    return {
        plan_id: planId,
        activity_name: activityName,
        place_name: activity.place_name || null,
        start_time: normalizeStartTime(activity.start_time),
        duration_minutes: normalizePositiveNumber(activity.duration_minutes),
        estimated_cost: normalizeNonNegativeNumber(activity.estimated_cost),
        indoor_outdoor: normalizeIndoorOutdoor(activity.indoor_outdoor),
        description: activity.description || activity.reason || null,
        is_backup: isBackup,
        sequence_order: sequenceOrder,
    };
};

export const createPlan = async ({
    location,
    budget,
    activityType,
    date,
    transportPreference,
}) => {
    if (!VALID_ACTIVITY_TYPES.has(activityType)) {
        throw createHttpError(
            'Activity type must be one of: date, hangout, family, solo'
        );
    }

    const normalizedBudget = normalizeBudget(budget);
    const eventDate = normalizeEventDate(date);
    const db = getDatabaseClient();

    const [weather, places] = await Promise.all([
        getWeatherData(location),
        fetchNearbyPlaces(location),
    ]);

    const routeContext = await getRouteContext({
        places,
        transportPreference,
    });

    const itinerary = await generateItinerary({
        location,
        budget: normalizedBudget,
        activityType,
        date,
        weather,
        places,
        transportPreference,
        routeContext,
    });

    if (!Array.isArray(itinerary.activities) || itinerary.activities.length === 0) {
        throw createHttpError('Generated itinerary is missing activities', 502);
    }

    if (!itinerary.title) {
        throw createHttpError('Generated itinerary is missing a title', 502);
    }

    itinerary.activities = applyWeatherRules(itinerary.activities, weather);
    itinerary.route_context = routeContext;
    itinerary.places = places;
    itinerary.validation = buildValidationMetadata(
        itinerary.activities,
        normalizedBudget,
        weather
    );

    if (!itinerary.validation.budget.withinBudget) {
        throw createHttpError(
            `Generated activities exceed the PHP ${normalizedBudget} budget`,
            422
        );
    }

    const { data: plan, error: planErr } = await db
        .from('plans')
        .insert({
            user_id: null,
            title: itinerary.title,
            location,
            budget: normalizedBudget,
            theme: activityType,
            event_date: eventDate,
            weather_summary: weather.description,
        })
        .select()
        .single();

    if (planErr) throw planErr;

    const activities = itinerary.activities.map((activity, index) =>
        normalizeActivity(activity, plan.plan_id, index + 1)
    );

    if (itinerary.backup_activity) {
        activities.push(
            normalizeActivity(
                itinerary.backup_activity,
                plan.plan_id,
                activities.length + 1,
                true
            )
        );
    }

    const { error: actErr } = await db.from('activities').insert(activities);
    if (actErr) throw actErr;

    return { plan, itinerary };
};

export const getPlanById = async (id) => {
    const db = getDatabaseClient();

    const [
        { data: plan, error: planErr },
        { data: activities, error: actErr },
    ] = await Promise.all([
        db.from('plans').select('*').eq('plan_id', id).single(),
        db.from('activities').select('*').eq('plan_id', id),
    ]);

    if (planErr?.code === 'PGRST116') {
        throw createHttpError('Plan not found', 404);
    }

    if (planErr) throw planErr;
    if (!plan) throw createHttpError('Plan not found', 404);
    if (actErr) throw actErr;

    return { plan, activities };
};

export const getAllPlans = async () => {
    const db = getDatabaseClient();

    const { data, error } = await db
        .from('plans')
        .select('*')
        .order('date_created', { ascending: false });

    if (error) throw error;

    return data;
};
