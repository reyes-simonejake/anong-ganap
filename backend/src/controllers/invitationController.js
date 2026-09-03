import { generateInvitationMessage } from '../services/aiService.js';
import { sendEmail, buildInvitationHTML } from '../services/emailService.js';
import { supabase } from '../config/supabase.js';

export const createInvitation = async (req, res, next) => {
    try {
        const { planId } = req.body;

        const { data: plan, error: planErr } = await supabase
            .from('plans')
            .select('*')
            .eq('plan_id', planId)
            .single();

        if (planErr) throw planErr;
        if (!plan)
            return res
                .status(404)
                .json({ success: false, error: 'Plan not found' });

        const { data: activities, error: actErr } = await supabase
            .from('activities')
            .select('*')
            .eq('plan_id', planId);

        if (actErr) throw actErr;

        const message = await generateInvitationMessage(plan, activities);

        res.json({ success: true, message });
    } catch (err) {
        next(err);
    }
};

export const sendInvitation = async (req, res, next) => {
    try {
        const { planId, receiverEmail, message } = req.body;

        const { data: plan, error: planErr } = await supabase
            .from('plans')
            .select('*')
            .eq('plan_id', planId)
            .single();

        if (planErr) throw planErr;
        if (!plan)
            return res
                .status(404)
                .json({ success: false, error: 'Plan not found' });

        const inviteLink = `${process.env.FRONTEND_URL}/plan/${planId}`;
        const htmlBody = buildInvitationHTML(plan, message, inviteLink);

        await sendEmail(
            receiverEmail,
            "You're Invited to Anong Ganap! 🎉",
            message,
            htmlBody
        );

        const { data, error } = await supabase
            .from('invitations')
            .insert({
                plan_id: planId,
                receiver_email: receiverEmail,
                invitation_message: message,
                sent_status: 'sent',
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, invitation: data });
    } catch (err) {
        next(err);
    }
};
