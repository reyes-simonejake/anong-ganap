import express from 'express';
import { createPlan, getPlan, getAllPlans } from '../controllers/planController.js';

const router = express.Router();

router.post('/create', createPlan);
router.get('/:id', getPlan);
router.get('/', getAllPlans);

export default router;
