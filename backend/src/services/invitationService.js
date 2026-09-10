import { requireSupabase } from '../config/supabase.js';
import { generateInvitationMessage } from './aiService.js';
import { buildInvitationHTML, sendEmail } from './emailService.js';

const createHttpError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const normalizePlanId = (planId) => {
    const normalizedPlanId = Number(planId);

    if (!Number.isInteger(normalizedPlanId) || normalizedPlanId <= 0) {
        throw createHttpError('Plan ID must be a positive integer');
    }

    return normalizedPlanId;
};

const getPlanWithActivities = async (db, planId) => {
    const [{ data: plan, error: planError }, { data: activities, error: activitiesError }] =
        await Promise.all([
            db.from('plans').select('*').eq('plan_id', planId).single(),
            db.from('activities').select('*').eq('plan_id', planId),
        ]);

    if (planError?.code === 'PGRST116' || !plan) {
        throw createHttpError('Plan not found', 404);
    }
    if (planError) throw planError;
    if (activitiesError) throw activitiesError;

    return { plan, activities };
};

export const createInvitationMessage = async (planId) => {
    const db = requireSupabase();
    const normalizedPlanId = normalizePlanId(planId);
    const { plan, activities } = await getPlanWithActivities(db, normalizedPlanId);
    const message = await generateInvitationMessage(plan, activities);

    return { message };
};

export const sendInvitation = async ({ planId, receiverEmail, message }) => {
    const db = requireSupabase();
    const normalizedPlanId = normalizePlanId(planId);
    const normalizedEmail = receiverEmail?.trim();
    const normalizedMessage = message?.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail || '')) {
        throw createHttpError('Receiver email must be valid');
    }

    if (!normalizedMessage || normalizedMessage.length > 2000) {
        throw createHttpError('Invitation message must be 1 to 2000 characters');
    }

    const { plan } = await getPlanWithActivities(db, normalizedPlanId);
    const inviteLink = `${process.env.FRONTEND_URL || ''}/plan/${normalizedPlanId}`;
    const htmlBody = buildInvitationHTML(plan, normalizedMessage, inviteLink);

    const { data: invitation, error: insertError } = await db
        .from('invitations')
        .insert({
            plan_id: normalizedPlanId,
            receiver_email: normalizedEmail,
            invitation_message: normalizedMessage,
            sent_status: 'pending',
        })
        .select()
        .single();

    if (insertError) throw insertError;

    try {
        await sendEmail(
            normalizedEmail,
            "You're Invited to Anong Ganap!",
            normalizedMessage,
            htmlBody
        );
    } catch (error) {
        await db
            .from('invitations')
            .update({ sent_status: 'failed' })
            .eq('invitation_id', invitation.invitation_id);
        throw error;
    }

    const { data, error } = await db
        .from('invitations')
        .update({ sent_status: 'sent' })
        .eq('invitation_id', invitation.invitation_id)
        .select()
        .single();

    if (error) throw error;

    return { invitation: data };
};
