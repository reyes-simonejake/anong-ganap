import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateOutfitSuggestion = async (activityType, weather) => {
  try {
    const prompt = `Suggest matching couple outfits for a ${activityType} activity.

Weather: ${weather.description}, ${weather.temperature}°C

Provide coordinated outfit suggestions for Person A and Person B.

Format as JSON:
{
  "theme": "Outfit Theme Name",
  "personA": {
    "top": "...",
    "bottom": "...",
    "shoes": "...",
    "accessories": "..."
  },
  "personB": {
    "top": "...",
    "bottom": "...",
    "shoes": "...",
    "accessories": "..."
  },
  "weatherNote": "..."
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Outfit Service error:', error);
    throw new Error('Failed to generate outfit suggestion');
  }
};
