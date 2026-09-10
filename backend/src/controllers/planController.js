import * as planService from '../services/planService.js';

export const createPlan = async (req, res, next) => {
    try {
        const {
            location,
            budget,
            activityType,
            date,
            transportPreference,
        } = req.body;

        const result = await planService.createPlan({
            location,
            budget,
            activityType,
            date,
            transportPreference,
        });

        res.status(201).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

export const getPlan = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { plan, activities } = await planService.getPlanById(id);

        res.json({ success: true, plan, activities });
    } catch (err) {
        next(err);
    }
};

export const getAllPlans = async (req, res, next) => {
    try {
        const data = await planService.getAllPlans();

        res.json({ success: true, plans: data });
    } catch (err) {
        next(err);
    }
};
