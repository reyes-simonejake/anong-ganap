import express from 'express';
import { createInvitation, sendInvitation } from '../controllers/invitationController.js';

const router = express.Router();

router.post('/create', createInvitation);
router.post('/send', sendInvitation);

export default router;
