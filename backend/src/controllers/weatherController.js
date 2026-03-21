import { getWeatherData } from '../services/weatherService.js';

export const getWeather = async (req, res) => {
  try {
    const { location } = req.params;
    const weather = await getWeatherData(location);
    res.json({ weather });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
