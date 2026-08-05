const nodemailer = require('nodemailer');

function validateConsultationRequest(payload = {}) {
  const { preferredDate, preferredTime, reason, alternateEmail } = payload;

  if (!preferredDate || !preferredTime || !reason || !reason.trim()) {
    throw new Error('Preferred date, time, and reason are required');
  }

  const [year, month, day] = preferredDate.split('-').map(Number);
  const [hours, minutes] = preferredTime.split(':').map(Number);
  const requestedDateTime = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();

  if (Number.isNaN(requestedDateTime.getTime()) || requestedDateTime <= now) {
    throw new Error('Consultation time must be in the future');
  }

  if (alternateEmail) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(alternateEmail)) {
      throw new Error('Alternate email must be a valid email address');
    }
  }

  return {
    preferredDate,
    preferredTime,
    reason: reason.trim(),
    alternateEmail: alternateEmail ? alternateEmail.trim() : '',
    preferredDateTime: requestedDateTime
  };
}

async function sendConsultationEmail({ to, subject, text, html }) {
  if (!to) return null;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  });

  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@sheba-connect.local',
    to,
    subject,
    text,
    html
  });
}

module.exports = { validateConsultationRequest, sendConsultationEmail };
