require("dotenv").config();
const nodemailer = require("nodemailer");

const isProd = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_Username,
    pass: process.env.SMTP_Password,
  },
  logger: !isProd,
  debug: !isProd,
  tls: { rejectUnauthorized: isProd }, // allow self-signed in dev only
});

// verify once on startup (log only)
transporter
  .verify()
  .then(() => console.log("✅ Brevo SMTP server connected successfully"))
  .catch((err) => console.error("❌ Brevo SMTP verify failed:", err.message));

// helper to send a test email
async function sendTestEmail(to) {
  const from =
    process.env.EMAIL_FROM ||
    `no-reply@${process.env.SMTP_DOMAIN || "example.com"}`;
  return transporter.sendMail({
    from,
    to,
    subject: "Test email from Train Booking",
    text: "This is a test email.",
    html: "<p>This is a test email.</p>",
  });
}

module.exports = { transporter, sendTestEmail };
