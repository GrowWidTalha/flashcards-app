const { Resend } = require('resend');
require('dotenv').config();

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a verification email to a user
 * @param {string} email - Recipient email address
 * @param {string} username - Recipient username
 * @param {string} verificationToken - The verification token
 * @returns {Promise<object>} - Response from Resend API
 */
const sendVerificationEmail = async (email, username, verificationToken) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    console.log(verificationUrl);
    console.log("sending email")
    try {
        const data = await resend.emails.send({
            from: 'Flashcards App <flashcardsapp@talhaali.xyz>',
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
                    <h2 style="color: #333;">Welcome to Flashcards App!</h2>
                    <p>Hi ${username},</p>
                    <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                    </div>
                    <p>Or copy and paste the following link in your browser:</p>
                    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                    <p>This link will expire in 12 hours.</p>
                    <p>If you did not sign up for a Flashcards App account, please ignore this email.</p>
                    <p>Thanks,<br>The Flashcards App Team</p>
                </div>
            `
        });

        return data;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

module.exports = {
    sendVerificationEmail
};
