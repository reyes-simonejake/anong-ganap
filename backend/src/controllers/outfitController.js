import { createOutfitSuggestion } from '../services/outfitService.js';

export const generateOutfit = async (req, res, next) => {
    try {
        const { planId, location, activityType } = req.body;

        const result = await createOutfitSuggestion({
            planId,
            location,
            activityType,
        });

        res.status(201).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};
