import { generateOutfitSuggestion } from '../services/outfitService.js';
import { getWeatherData } from '../services/weatherService.js';
import { supabase } from '../config/supabase.js';

export const generateOutfit = async (req, res) => {
  try {
    const { planId, location, activityType } = req.body;

    const weather = await getWeatherData(location);
    const outfit = await generateOutfitSuggestion(activityType, weather);

    // Save to database
    const { data, error } = await supabase
      .from('outfits')
      .insert({
        plan_id: planId,
        theme: outfit.theme,
        person_a_outfit: JSON.stringify(outfit.personA),
        person_b_outfit: JSON.stringify(outfit.personB),
        weather_adjusted: true
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, outfit: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
