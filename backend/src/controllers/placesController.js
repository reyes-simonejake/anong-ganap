import { fetchNearbyPlaces } from '../services/placesService.js';

export const getNearbyPlaces = async (req, res, next) => {
    try {
        const { location, type } = req.query;

        if (!location) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: 'location query param is required',
                });
        }

        const places = await fetchNearbyPlaces(location, type);
        res.json({ success: true, places });
    } catch (err) {
        next(err);
    }
};
