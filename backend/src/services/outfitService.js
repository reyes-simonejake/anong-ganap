import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function extractJSON(text) {
    const jsonMatch =
        text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        text.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) throw new Error('No JSON found in outfit AI response');
    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
}

/**
 * Returns a weather-aware clothing recommendation label.
 */
function getWeatherAdvice(weather) {
    if (!weather) return 'Check weather before heading out';
    const temp = weather.temperature;
    const desc = (weather.description || '').toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle'))
        return 'Bring an umbrella or light rain jacket';
    if (temp > 32)
        return 'Very hot — wear light, breathable fabrics and bring water';
    if (temp > 28) return 'Warm — light clothing recommended';
    if (temp < 20) return 'Cool — bring a light jacket or cardigan';
    return 'Comfortable weather — dress as you like';
}

/**
 * Generates coordinated outfit suggestions for a plan.
 * Supports solo or group outfits based on activityType.
 */
export const generateOutfitSuggestion = async (activityType, weather) => {
    const weatherAdvice = getWeatherAdvice(weather);

    const prompt = `Suggest coordinated outfit ideas for a ${activityType} activity in the Philippines.

Weather: ${weather?.description || 'unknown'}, ${weather?.temperature ?? '?'}°C
Weather advice: ${weatherAdvice}

Consider Filipino fashion sensibilities and the local climate.
Provide suggestions for two people (Person A and Person B) with a matching/complementary theme.

Return ONLY valid JSON:
{
  "theme": "Outfit Theme Name",
  "weatherNote": "${weatherAdvice}",
  "pinterestSearchQuery": "{color} {style} ${activityType} outfit Philippines",
  "personA": {
    "top": "description",
    "bottom": "description",
    "shoes": "description",
    "accessories": "description",
    "colorPalette": ["#hex1", "#hex2"]
  },
  "personB": {
    "top": "description",
    "bottom": "description",
    "shoes": "description",
    "accessories": "description",
    "colorPalette": ["#hex1", "#hex2"]
  }
}`;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    return extractJSON(response.choices[0].message.content);
};
