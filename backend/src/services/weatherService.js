import axios from 'axios';

const isMissingOrPlaceholder = (value) => {
  const normalizedValue = value?.trim().toLowerCase();
  return (
    !normalizedValue ||
    normalizedValue.startsWith('your_') ||
    normalizedValue.includes('placeholder')
  );
};

const getMockWeather = (location) => {
  const normalizedLocation = location?.toLowerCase() || '';

  if (
    normalizedLocation.includes('baguio') ||
    normalizedLocation.includes('tagaytay')
  ) {
    return {
      temperature: 22,
      description: 'Clouds',
      humidity: 82,
      windSpeed: 3.4,
      icon: '03d',
    };
  }

  if (
    normalizedLocation.includes('cebu') ||
    normalizedLocation.includes('davao')
  ) {
    return {
      temperature: 31,
      description: 'Clear',
      humidity: 68,
      windSpeed: 4.1,
      icon: '01d',
    };
  }

  if (
    normalizedLocation.includes('manila') ||
    normalizedLocation.includes('quezon') ||
    normalizedLocation.includes('makati') ||
    normalizedLocation.includes('taguig')
  ) {
    return {
      temperature: 30,
      description: 'Clouds',
      humidity: 74,
      windSpeed: 2.8,
      icon: '02d',
    };
  }

  return {
    temperature: 29,
    description: 'Partly cloudy',
    humidity: 76,
    windSpeed: 3.2,
    icon: '02d',
  };
};

export const getWeatherData = async (location) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    if (isMissingOrPlaceholder(apiKey)) {
      return getMockWeather(location);
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: location,
          appid: apiKey,
          units: 'metric',
        },
      }
    );
    const data = response.data;

    return {
      temperature: data.main.temp,
      description: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data');
  }
};
