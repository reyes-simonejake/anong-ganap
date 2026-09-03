import { getWeatherData } from '../services/weatherService.js';

export const getWeather = async (req, res, next) => {
    try {
        const { location } = req.params;
        const weather = await getWeatherData(decodeURIComponent(location));
        res.json({ success: true, weather });
    } catch (err) {
        next(err);
    }
};
