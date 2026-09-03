import express from 'express';
import {
    createPlan,
    getPlan,
    getAllPlans,
} from '../controllers/planController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
    '/create',
    validate(['location', 'budget', 'activityType']),
    createPlan
);
router.get('/:id', getPlan);
router.get('/', getAllPlans);

export default router;
