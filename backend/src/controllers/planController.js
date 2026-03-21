import { supabase } from '../config/supabase.js';
import { generateItinerary } from '../services/aiService.js';
import { getWeatherData } from '../services/weatherService.js';
import { fetchNearbyPlaces } from '../services/placesService.js';

export const createPlan = async (req, res) => {
  try {
    const { userId, location, budget, activityType, date, transportPreference } = req.body;

    // Get weather data
    const weather = await getWeatherData(location);

    // Get nearby places
    const places = await fetchNearbyPlaces(location);

    // Generate AI itinerary
    const itinerary = await generateItinerary({
      location,
      budget,
      activityType,
      weather,
      places,
      transportPreference
    });

    // Save to database
    const { data, error } = await supabase
      .from('plans')
      .insert({
        user_id: userId,
        title: itinerary.title,
        location,
        budget,
        theme: activityType,
        date_created: new Date(),
        weather_summary: weather.description
      })
      .select()
      .single();

    if (error) throw error;

    // Save activities
    const activities = itinerary.activities.map(activity => ({
      plan_id: data.plan_id,
      ...activity
    }));

    await supabase.from('activities').insert(activities);

    res.json({ success: true, plan: data, itinerary });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('plan_id', id)
      .single();

    if (planError) throw planError;

    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('plan_id', id);

    if (activitiesError) throw activitiesError;

    res.json({ plan, activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPlans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('date_created', { ascending: false });

    if (error) throw error;

    res.json({ plans: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
