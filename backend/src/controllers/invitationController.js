import { generateInvitationMessage } from '../services/aiService.js';
import { sendEmail } from '../services/emailService.js';
import { supabase } from '../config/supabase.js';

export const createInvitation = async (req, res) => {
  try {
    const { planId } = req.body;

    // Get plan details
    const { data: plan } = await supabase
      .from('plans')
      .select('*')
      .eq('plan_id', planId)
      .single();

    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('plan_id', planId);

    const message = await generateInvitationMessage(plan, activities);

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendInvitation = async (req, res) => {
  try {
    const { planId, receiverEmail, message } = req.body;

    await sendEmail(receiverEmail, 'You\'re Invited!', message);

    // Save invitation record
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        plan_id: planId,
        receiver_email: receiverEmail,
        invitation_message: message,
        sent_status: 'sent'
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, invitation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
