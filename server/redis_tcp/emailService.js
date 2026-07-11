// services/emailService.js
const {transporter} = require("./email");
require("dotenv").config();

/**
 * Send an email via Brevo SMTP
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Optional plain text body
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ""), // fallback text version
    });

    console.log(`📨 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email delivery failed");
  }
}

module.exports = { sendEmail };
