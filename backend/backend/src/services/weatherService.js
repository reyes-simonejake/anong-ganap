import axios from 'axios';
import { getOrSet, invalidate } from '../utils/cache.js';

// Cache key format: weather:{location}
const WEATHER_TTL = 600; // 10 minutes

export const getWeatherData = async (location) => {
  return await getOrSet(
    `weather:${location}`,
    WEATHER_TTL,
    async () => {
      try {
        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(url);
        const data = response.data;
        
        return {
          temperature: data.main.temp,
          description: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon
        };
      } catch (error) {
        console.error('Weather API error:', error);
        throw new Error('Failed to fetch weather data');
      }
    }
  );
};

/**
 * Invalidate weather cache for a specific location.
 * Useful when you know the weather data has changed.
 * 
 * @param {string} location - Location to invalidate cache for
 * @returns {Promise<void>}
 */
export const invalidateWeatherCache = async (location) => {
  await invalidate(`weather:${location}`);
};