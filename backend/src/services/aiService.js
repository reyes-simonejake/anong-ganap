import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateItinerary = async ({ location, budget, activityType, weather, places, transportPreference }) => {
  try {
    const prompt = `Generate a detailed activity itinerary for a ${activityType} in ${location}.

Budget: ₱${budget}
Weather: ${weather.description}, ${weather.temperature}°C
Transport: ${transportPreference}

Available places: ${places.map(p => p.name).join(', ')}

Create a timeline with:
- Activity name
- Location
- Start time
- Estimated cost
- Duration

Format as JSON with structure:
{
  "title": "Activity Title",
  "activities": [
    {
      "activity_name": "...",
      "place_name": "...",
      "start_time": "HH:MM",
      "estimated_cost": number,
      "indoor_outdoor": "indoor/outdoor"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI Service error:', error);
    throw new Error('Failed to generate itinerary');
  }
};

export const generateInvitationMessage = async (plan, activities) => {
  try {
    const prompt = `Create a warm, personalized invitation message for a ${plan.theme} activity.

Plan details:
- Location: ${plan.location}
- Activities: ${activities.map(a => a.activity_name).join(', ')}

Make it friendly and exciting. Keep it under 150 words.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI Service error:', error);
    throw new Error('Failed to generate invitation');
  }
};
