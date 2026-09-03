import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
}) => {
    const placesContext = places?.length
        ? `Available nearby places: ${places.map((p) => p.name).join(', ')}`
        : 'No specific places provided — suggest popular spots in the area.';

    const prompt = `You are a helpful Filipino activity planner. Generate a detailed day itinerary for a ${activityType} outing.

Details:
- Location: ${location}
- Date: ${date || 'this weekend'}
- Budget: ₱${budget}
- Transport: ${transportPreference || 'any'}
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

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    return extractJSON(response.choices[0].message.content);
};

/**
 * Generates a warm invitation message for a plan.
 */
export const generateInvitationMessage = async (plan, activities) => {
    const activityList =
        activities?.map((a) => a.activity_name).join(', ') ||
        'exciting activities';

    const prompt = `Write a short, warm, and exciting invitation message for a ${plan.theme} outing in ${plan.location}.
Activities planned: ${activityList}.
Keep it under 120 words, friendly Filipino tone, include a call-to-action.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
    });

    return response.choices[0].message.content.trim();
};
