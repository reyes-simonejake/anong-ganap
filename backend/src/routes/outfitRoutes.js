import express from 'express';
import { generateOutfit } from '../controllers/outfitController.js';

const router = express.Router();

router.post('/generate', generateOutfit);

export default router;
