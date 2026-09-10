import {
    createInvitationMessage,
    sendInvitation as sendInvitationService,
} from '../services/invitationService.js';

export const createInvitation = async (req, res, next) => {
    try {
        const { planId } = req.body;
        const result = await createInvitationMessage(planId);

        res.json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

export const sendInvitation = async (req, res, next) => {
    try {
        const { planId, receiverEmail, message } = req.body;
        const result = await sendInvitationService({
            planId,
            receiverEmail,
            message,
        });

        res.json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};
