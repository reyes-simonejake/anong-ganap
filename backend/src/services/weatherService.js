import axios from 'axios';

export const getWeatherData = async (location) => {
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
};
