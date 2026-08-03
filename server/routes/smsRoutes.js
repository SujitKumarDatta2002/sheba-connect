/**
 * routes/smsRoutes.js
 * Authenticated endpoint that lets the frontend trigger an SMS via Alpha SMS API.
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { sendSMS } = require('../services/smsService');

/**
 * POST /api/sms/send
 * Body: { phone, message }
 * Protected: requires JWT
 */
router.post('/send', authMiddleware, async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, error: 'phone and message are required' });
  }

  try {
    const result = await sendSMS(phone, message);
    return res.json({ success: true, result });
  } catch (err) {
    // SMS failure is non-fatal — return 200 with error details
    // so the frontend application flow is not interrupted
    console.warn('[SMS Route] SMS sending failed (non-fatal):', err.message);
    return res.json({
      success: false,
      smsError: err.message,
      note: 'SMS could not be sent but the operation continues'
    });
  }
});

module.exports = router;
