import express from 'express';
import {
    createInvitation,
    sendInvitation,
} from '../controllers/invitationController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/create', validate(['planId']), createInvitation);
router.post(
    '/send',
    validate(['planId', 'receiverEmail', 'message']),
    sendInvitation
);

export default router;
