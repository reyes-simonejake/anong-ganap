import { fetchNearbyPlaces } from '../services/placesService.js';

export const getNearbyPlaces = async (req, res) => {
  try {
    const { location, type } = req.query;
    const places = await fetchNearbyPlaces(location, type);
    res.json({ places });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
