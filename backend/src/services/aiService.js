import OpenAI from 'openai';

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
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    return openaiClient;
};

const getFallbackPlace = (places, index, fallbackName) => {
    return places?.[index]?.name || fallbackName;
};

const buildMockItinerary = ({
    location,
    budget,
    activityType,
    date,
    weather,
    places,
}) => {
    const normalizedBudget = Number.isFinite(Number(budget)) ? Number(budget) : 1500;
    const activityBudget = Math.max(0, Math.floor(normalizedBudget / 3));
    const weatherDescription = weather?.description || 'partly cloudy';
    const indoorOutdoor =
        weatherDescription.toLowerCase().includes('rain') ? 'indoor' : 'outdoor';

    return {
        title: `${activityType || 'hangout'} plan in ${location}`,
        totalEstimatedCost: activityBudget * 3,
        activities: [
            {
                activity_name: 'Start with a casual meal',
                place_name: getFallbackPlace(places, 0, `${location} local restaurant`),
                start_time: '10:00',
                estimated_cost: activityBudget,
                duration_minutes: 90,
                indoor_outdoor: 'indoor',
                description: `Have an easy meal near ${location} before the main activity.`,
            },
            {
                activity_name: 'Explore a nearby spot',
                place_name: getFallbackPlace(places, 1, `${location} activity spot`),
                start_time: '12:00',
                estimated_cost: activityBudget,
                duration_minutes: 120,
                indoor_outdoor: indoorOutdoor,
                description: `Visit a local place that fits the ${weatherDescription.toLowerCase()} weather.`,
            },
            {
                activity_name: 'Wind down with snacks or coffee',
                place_name: getFallbackPlace(places, 2, `${location} cafe`),
                start_time: '15:00',
                estimated_cost: activityBudget,
                duration_minutes: 75,
                indoor_outdoor: 'indoor',
                description: 'End the plan with time to rest, talk, and adjust before heading home.',
            },
        ],
        backup_activity: {
            activity_name: 'Move to an indoor mall or cafe',
            place_name: getFallbackPlace(places, 3, `${location} indoor backup spot`),
            reason: 'Good backup if the weather changes or the group wants a slower pace.',
        },
        weather_note: `Expected weather is ${weatherDescription} at around ${weather?.temperature ?? 29}C.`,
        date: date || null,
    };
};

/**
 * Extracts the first valid JSON object/array from a string.
 * Guards against GPT wrapping JSON in markdown code fences.
 */
function extractJSON(text) {
    const jsonMatch =
        text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!jsonMatch) throw new Error('No JSON found in AI response');
    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
}

/**
 * Generates a full itinerary with 3 activities and backup options.
 */
export const generateItinerary = async ({
    location,
    budget,
    activityType,
    date,
    weather,
    places,
    transportPreference,
    routeContext,
}) => {
    if (isMissingOrPlaceholder(process.env.OPENAI_API_KEY)) {
        return buildMockItinerary({
            location,
            budget,
            activityType,
            date,
            weather,
            places,
        });
    }

    const placesContext = places?.length
        ? `Available nearby places: ${places.map((p) => p.name).join(', ')}`
        : 'No specific places provided — suggest popular spots in the area.';

    const prompt = `You are a helpful Filipino activity planner. Generate a detailed day itinerary for a ${activityType} outing.

Details:
- Location: ${location}
- Date: ${date || 'this weekend'}
- Budget: ₱${budget}
- Transport: ${transportPreference || 'any'}
- Route context: ${routeContext?.distanceMeters || 0} meters over ${routeContext?.durationSeconds || 0} seconds via ${routeContext?.provider || 'local fallback'}
- Weather: ${weather?.description || 'unknown'}, ${weather?.temperature ?? '?'}°C
${placesContext}

Rules:
- Exactly 3 main activities + 1 backup activity
- Stay within budget total
- Consider weather (if hot/rainy, prefer indoor options)
- Include Filipino context (prices in ₱, local spots)

Return ONLY valid JSON, no markdown:
{
  "title": "Fun Plan Title",
  "totalEstimatedCost": number,
  "activities": [
    {
      "activity_name": "string",
      "place_name": "string",
      "start_time": "HH:MM",
      "estimated_cost": number,
      "duration_minutes": number,
      "indoor_outdoor": "indoor" | "outdoor",
      "description": "short description"
    }
  ],
  "backup_activity": {
    "activity_name": "string",
    "place_name": "string",
    "reason": "why this is a good backup"
  },
  "weather_note": "string"
}`;

    try {
        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        return extractJSON(response.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI itinerary generation error:', error.message);
        throw new Error('Failed to generate itinerary');
    }
};

/**
 * Generates a warm invitation message for a plan.
 */
export const generateInvitationMessage = async (plan, activities) => {
    const activityList =
        activities?.map((a) => a.activity_name).join(', ') ||
        'exciting activities';

    if (isMissingOrPlaceholder(process.env.OPENAI_API_KEY)) {
        return `Join me for a ${plan.theme} outing in ${plan.location}. Planned stops include ${activityList}. Confirm when you can so we can finalize the plan.`;
    }

    const prompt = `Write a short, warm, and exciting invitation message for a ${plan.theme} outing in ${plan.location}.
Activities planned: ${activityList}.
Keep it under 120 words, friendly Filipino tone, include a call-to-action.`;

    try {
        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI invitation generation error:', error.message);
        throw new Error('Failed to generate invitation message');
    }
};
