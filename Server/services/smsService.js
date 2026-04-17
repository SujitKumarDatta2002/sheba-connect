/**
 * services/smsService.js
 *
 * Multi-provider notification service. Switch via SMS_PROVIDER in .env:
 *
 *   SMS_PROVIDER=whatsapp  → Twilio WhatsApp Sandbox (FREE, no BD verification)
 *   SMS_PROVIDER=twilio    → Twilio SMS (free trial, BD numbers may be blocked)
 *   SMS_PROVIDER=alphasms  → Alpha SMS / sms.net.bd (requires ৳1500 recharge)
 *
 * WhatsApp Sandbox Setup (FREE):
 *   1. Go to https://console.twilio.com
 *   2. Messaging → Try it out → Send a WhatsApp message
 *   3. From your WhatsApp, send "join <word>" to +14155238886
 *   4. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in .env
 */

const axios = require('axios');

// ── Phone helpers ─────────────────────────────────────────────────────────────

function toE164(phone) {
  let cleaned = String(phone).replace(/[\s\-]/g, '');
  if (cleaned.startsWith('+')) return cleaned;          // already E.164
  if (cleaned.startsWith('880')) return `+${cleaned}`;  // 8801... → +8801...
  if (cleaned.startsWith('01'))  return `+88${cleaned}`; // 01...   → +8801...
  return `+${cleaned}`;
}

function toWhatsApp(phone) {
  return `whatsapp:${toE164(phone)}`;
}

// ── Provider: Twilio WhatsApp Sandbox ─────────────────────────────────────────

async function sendViaWhatsApp(phone, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

  if (!accountSid || !authToken || accountSid === 'your_account_sid_here') {
    throw new Error(
      'Twilio WhatsApp not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env'
    );
  }

  let twilioClient;
  try {
    twilioClient = require('twilio')(accountSid, authToken);
  } catch {
    throw new Error('Twilio package not installed. Run: npm install twilio  (in /server folder using Git Bash)');
  }

  const to = toWhatsApp(phone);
  console.log(`[WhatsApp] 📤 Sending to ${to}: "${message.substring(0, 60)}..."`);

  const msg = await twilioClient.messages.create({
    body: message,
    from,
    to,
  });

  console.log(`[WhatsApp] ✅ Sent — SID: ${msg.sid}, Status: ${msg.status}`);
  return { success: true, sid: msg.sid, channel: 'whatsapp' };
}

// ── Provider: Twilio SMS ──────────────────────────────────────────────────────

async function sendViaTwilioSMS(phone, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !from || accountSid === 'your_account_sid_here') {
    throw new Error('Twilio SMS not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER in .env');
  }

  let twilioClient;
  try {
    twilioClient = require('twilio')(accountSid, authToken);
  } catch {
    throw new Error('Twilio package not installed. Run: npm install twilio');
  }

  const to = toE164(phone);
  console.log(`[SMS/Twilio] 📤 Sending to ${to}: "${message.substring(0, 60)}..."`);

  const msg = await twilioClient.messages.create({ body: message, from, to });
  console.log(`[SMS/Twilio] ✅ Sent — SID: ${msg.sid}`);
  return { success: true, sid: msg.sid, channel: 'sms' };
}

// ── Provider: Alpha SMS (sms.net.bd) ─────────────────────────────────────────

const ALPHA_ERRORS = {
  401: 'Invalid API key',
  413: 'Invalid Sender ID — leave ALPHA_SENDER_ID empty',
  416: 'No valid recipient number',
  421: 'Insufficient balance — please recharge at sms.net.bd',
};

async function sendViaAlphaSMS(phone, message) {
  const apiKey   = process.env.ALPHA_API_KEY;
  const senderId = process.env.ALPHA_SENDER_ID;

  if (!apiKey || apiKey === 'your_alpha_sms_api_key_here') {
    throw new Error('Alpha SMS not configured. Set ALPHA_API_KEY in .env');
  }

  let to = String(phone).replace(/[\s\-]/g, '');
  if (to.startsWith('+880')) to = to.slice(1);
  else if (to.startsWith('01')) to = `88${to}`;

  const payload = new URLSearchParams();
  payload.append('api_key', apiKey);
  payload.append('msg', message.trim());
  payload.append('to', to);
  if (senderId && senderId.trim()) payload.append('sender_id', senderId.trim());

  console.log(`[SMS/Alpha] 📤 Sending to ${to}`);
  const res = await axios.post('https://api.sms.net.bd/sendsms', payload.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 10_000,
  });

  if (res.data.error !== 0) {
    const errMsg = ALPHA_ERRORS[res.data.error] || `API error ${res.data.error}`;
    throw new Error(`SMS API error ${res.data.error}: ${errMsg}`);
  }

  console.log(`[SMS/Alpha] ✅ Sent — request_id: ${res.data.data?.request_id}`);
  return { success: true, requestId: res.data.data?.request_id, channel: 'sms' };
}

// ── Core: sendSMS — auto-selects provider ────────────────────────────────────

async function sendSMS(phone, message) {
  const provider = (process.env.SMS_PROVIDER || 'whatsapp').toLowerCase().trim();

  console.log(`[Notify] Provider: ${provider} | To: ${phone}`);

  switch (provider) {
    case 'whatsapp':
      return sendViaWhatsApp(phone, message);
    case 'twilio':
      return sendViaTwilioSMS(phone, message);
    case 'alphasms':
      return sendViaAlphaSMS(phone, message);
    default:
      throw new Error(`Unknown SMS_PROVIDER "${provider}". Use: whatsapp | twilio | alphasms`);
  }
}

// ── Convenience helpers (used by controllers) ────────────────────────────────

async function notifyComplaintStatus(phone, status) {
  const msg = `🔔 *Sheba Connect*\nYour complaint status has been updated to: *${status}*\n\nThank you for using our service.`;
  return sendSMS(phone, msg).catch(err =>
    console.warn('[Notify] notifyComplaintStatus failed (non-fatal):', err.message)
  );
}

async function notifyDocumentVerified(phone, documentName) {
  const msg = `✅ *Sheba Connect*\nYour document *${documentName}* has been *verified* successfully!\n\nYou may now apply for related services.`;
  return sendSMS(phone, msg).catch(err =>
    console.warn('[Notify] notifyDocumentVerified failed (non-fatal):', err.message)
  );
}

async function notifyApplicationStatus(phone, serviceName, status) {
  const msg = `📋 *Sheba Connect*\nYour application for *${serviceName}* is now: *${status}*\n\nLog in to your account for details.`;
  return sendSMS(phone, msg).catch(err =>
    console.warn('[Notify] notifyApplicationStatus failed (non-fatal):', err.message)
  );
}

module.exports = {
  sendSMS,
  notifyComplaintStatus,
  notifyDocumentVerified,
  notifyApplicationStatus,
};
