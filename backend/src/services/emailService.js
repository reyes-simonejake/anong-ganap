import axios from 'axios';

export const sendEmail = async (to, subject, message) => {
  try {
    // Using Mailjet API (you can switch to SendinBlue/other)
    const apiKey = process.env.EMAIL_API_KEY;
    const apiSecret = process.env.EMAIL_API_SECRET;

    // Placeholder - implement based on your email service
    console.log(`Sending email to ${to}: ${subject}`);
    console.log(message);

    // Example Mailjet implementation:
    // const response = await axios.post(
    //   'https://api.mailjet.com/v3.1/send',
    //   {
    //     Messages: [{
    //       From: { Email: 'noreply@anongganap.com', Name: 'Anong Ganap' },
    //       To: [{ Email: to }],
    //       Subject: subject,
    //       TextPart: message
    //     }]
    //   },
    //   {
    //     auth: { username: apiKey, password: apiSecret }
    //   }
    // );

    return { success: true };
  } catch (error) {
    console.error('Email Service error:', error);
    throw new Error('Failed to send email');
  }
};
