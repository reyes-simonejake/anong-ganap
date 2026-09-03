import { supabase } from '../config/supabase.js';
import { generateItinerary } from '../services/aiService.js';
import { getWeatherData } from '../services/weatherService.js';
import { fetchNearbyPlaces } from '../services/placesService.js';

export const createPlan = async (req, res, next) => {
    try {
        const {
            userId,
            location,
            budget,
            activityType,
            date,
            transportPreference,
        } = req.body;

        // Parallel fetch: weather + places
        const [weather, places] = await Promise.all([
            getWeatherData(location),
            fetchNearbyPlaces(location),
        ]);

        const itinerary = await generateItinerary({
            location,
            budget,
            activityType,
            date,
            weather,
            places,
            transportPreference,
        });

        const { data: plan, error: planErr } = await supabase
            .from('plans')
            .insert({
                user_id: userId || null,
                title: itinerary.title,
                location,
                budget: Number(budget),
                theme: activityType,
                date_created: new Date().toISOString(),
                weather_summary: weather.description,
            })
            .select()
            .single();

        if (planErr) throw planErr;

        const activities = itinerary.activities.map((activity) => ({
            plan_id: plan.plan_id,
            ...activity,
        }));

        const { error: actErr } = await supabase
            .from('activities')
            .insert(activities);
        if (actErr) throw actErr;

        res.status(201).json({ success: true, plan, itinerary });
    } catch (err) {
        next(err);
    }
};

export const getPlan = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [
            { data: plan, error: planErr },
            { data: activities, error: actErr },
        ] = await Promise.all([
            supabase.from('plans').select('*').eq('plan_id', id).single(),
            supabase.from('activities').select('*').eq('plan_id', id),
        ]);

        if (planErr) throw planErr;
        if (!plan)
            return res
                .status(404)
                .json({ success: false, error: 'Plan not found' });
        if (actErr) throw actErr;

        res.json({ success: true, plan, activities });
    } catch (err) {
        next(err);
    }
};

export const getAllPlans = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .order('date_created', { ascending: false });

        if (error) throw error;

        res.json({ success: true, plans: data });
    } catch (err) {
        next(err);
    }
};
