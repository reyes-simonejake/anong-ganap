import OpenAI from 'openai';

import { requireSupabase } from '../config/supabase.js';
import { getWeatherData } from './weatherService.js';

let openaiClient;

const isMissingOrPlaceholder = (value) => {
    const normalizedValue = value?.trim().toLowerCase();
    return (
        !normalizedValue ||
        normalizedValue.startsWith('your_') ||
        normalizedValue.includes('placeholder')
    );
};

const getOpenAIClient = () => {
    if (!openaiClient) {
        openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    return openaiClient;
};

const extractJSON = (text) => {
    const jsonMatch =
        text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        text.match(/(\{[\s\S]*\})/);

    if (!jsonMatch) throw new Error('No JSON found in outfit AI response');
    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
};

const getWeatherAdvice = (weather) => {
    if (!weather) return 'Check weather before heading out';

    const temperature = Number(weather.temperature);
    const description = (weather.description || '').toLowerCase();

    if (/rain|drizzle|storm|thunder/.test(description)) {
        return 'Bring an umbrella or light rain jacket';
    }
    if (temperature > 32) return 'Very hot - wear light, breathable fabrics and bring water';
    if (temperature > 28) return 'Warm - light clothing recommended';
    if (temperature < 20) return 'Cool - bring a light jacket or cardigan';
    return 'Comfortable weather - dress as you like';
};

const buildFallbackSuggestion = (activityType, weather) => {
    const weatherAdvice = getWeatherAdvice(weather);
    const isRainy = /rain|drizzle|storm|thunder/i.test(weather?.description || '');
    const isHot = Number(weather?.temperature) > 32;
    const palette = isRainy ? ['#1F2937', '#60A5FA'] : ['#0F766E', '#F59E0B'];

    return {
        theme: `${activityType || 'hangout'}-ready Filipino casual`,
        weatherNote: weatherAdvice,
        pinterestSearchQuery: `${activityType || 'hangout'} outfit Philippines`,
        personA: {
            top: isHot ? 'Breathable short-sleeve top' : 'Lightweight smart-casual top',
            bottom: 'Comfortable trousers or clean shorts',
            shoes: 'Comfortable walking shoes',
            accessories: isRainy ? 'Compact umbrella and water-resistant bag' : 'Simple watch and sunglasses',
            colorPalette: palette,
        },
        personB: {
            top: isHot ? 'Light blouse or breathable polo' : 'Light cardigan over a casual top',
            bottom: 'Relaxed skirt, trousers, or jeans',
            shoes: 'Comfortable flats or sneakers',
            accessories: isRainy ? 'Compact umbrella and small towel' : 'Simple crossbody bag',
            colorPalette: palette,
        },
    };
};

const generateSuggestion = async (activityType, weather) => {
    const weatherAdvice = getWeatherAdvice(weather);
    const fallback = buildFallbackSuggestion(activityType, weather);

    if (isMissingOrPlaceholder(process.env.OPENAI_API_KEY)) {
        return fallback;
    }

    const prompt = `Suggest coordinated outfits for a ${activityType} activity in the Philippines.
Weather: ${weather?.description || 'unknown'}, ${weather?.temperature ?? '?'}C
Weather advice: ${weatherAdvice}
Use Filipino fashion sensibilities and local climate awareness. Return only valid JSON with theme, weatherNote, pinterestSearchQuery, personA, and personB. Each person must include top, bottom, shoes, accessories, and colorPalette.`;

    try {
        const response = await getOpenAIClient().chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        return extractJSON(response.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI outfit generation failed; using fallback:', error.message);
        return fallback;
    }
};

export const createOutfitSuggestion = async ({ planId, location, activityType }) => {
    const db = requireSupabase();
    const weather = await getWeatherData(location);
    const suggestions = await generateSuggestion(activityType, weather);

    const { data, error } = await db
        .from('outfits')
        .insert({
            plan_id: planId,
            theme: activityType,
            person_a_outfit: suggestions.personA,
            person_b_outfit: suggestions.personB,
            weather_adjusted: true,
            pinterest_search_query: suggestions.pinterestSearchQuery,
        })
        .select()
        .single();

    if (error) throw error;

    return { outfit: data, suggestions };
};
