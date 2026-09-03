import express from 'express';
import { generateOutfit } from '../controllers/outfitController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
    '/generate',
    validate(['planId', 'location', 'activityType']),
    generateOutfit
);

export default router;
