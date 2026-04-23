/**
 * jobs/reminderJob.js
 *
 * Cron job for sending scheduled SMS reminders.
 *
 * Schedule: Runs daily at 8:00 AM (server local time).
 *
 * What it does:
 *   1. Finds service applications that have been "under_review" for > 7 days
 *      and sends an SMS reminder to the applicant.
 *   2. Finds complaints that are "Pending" for > 3 days and sends a reminder
 *      that their complaint is being tracked.
 *
 * Usage:
 *   const { startReminderJob } = require('./jobs/reminderJob');
 *   startReminderJob(); // call once on server startup
 *
 * Dependencies: node-cron (already in package.json), smsService
 */

const cron               = require('node-cron');
const ServiceApplication = require('../models/ServiceApplication');
const Complaint          = require('../models/Complaint');
const { sendSMS }        = require('../services/smsService');

// ── Utility ──────────────────────────────────────────────────────────────────

/** Returns a Date set to N days ago from now */
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ── Task 1: Service application review reminders ─────────────────────────────

async function sendApplicationReminders() {
  try {
    console.log('[ReminderJob] 🔔 Checking for stale service applications...');

    // Applications stuck in "under_review" for more than 7 days
    const staleApplications = await ServiceApplication.find({
      status: 'under_review',
      reviewedAt: { $lt: daysAgo(7) },
    })
      .populate('userId', 'name phone')
      .populate('serviceId', 'name');

    if (staleApplications.length === 0) {
      console.log('[ReminderJob] ✅ No stale applications found.');
      return;
    }

    console.log(`[ReminderJob] 📋 Found ${staleApplications.length} stale application(s). Sending reminders...`);

    for (const app of staleApplications) {
      const phone = app.userId?.phone;
      if (!phone) continue;

      const serviceName = app.serviceId?.name || app.serviceName || 'your service';
      const message = `[ShebaConnect] Reminder: Your application for "${serviceName}" is still under review. We appreciate your patience. For inquiries, please visit the portal.`;

      try {
        await sendSMS(phone, message);
        console.log(`[ReminderJob] ✅ Reminder sent to ${phone} for application ${app._id}`);
      } catch (err) {
        console.warn(`[ReminderJob] ⚠️  Failed to send reminder to ${phone}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[ReminderJob] ❌ Error in sendApplicationReminders:', err.message);
  }
}

// ── Task 2: Complaint pending reminders ──────────────────────────────────────

async function sendComplaintReminders() {
  try {
    console.log('[ReminderJob] 🔔 Checking for long-pending complaints...');

    // Complaints still "Pending" for more than 3 days
    const pendingComplaints = await Complaint.find({
      status: 'Pending',
      createdAt: { $lt: daysAgo(3) },
    });

    if (pendingComplaints.length === 0) {
      console.log('[ReminderJob] ✅ No pending complaints needing reminders.');
      return;
    }

    console.log(`[ReminderJob] 📋 Found ${pendingComplaints.length} pending complaint(s). Sending reminders...`);

    for (const complaint of pendingComplaints) {
      const phone = complaint.contactNumber;
      if (!phone) continue;

      const message = `[ShebaConnect] Reminder: Your complaint #${complaint.complaintNumber || complaint._id.toString().slice(-6).toUpperCase()} is still being tracked. Current status: Pending. We will update you once it is processed.`;

      try {
        await sendSMS(phone, message);
        console.log(`[ReminderJob] ✅ Complaint reminder sent to ${phone}`);
      } catch (err) {
        console.warn(`[ReminderJob] ⚠️  Failed to send complaint reminder to ${phone}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[ReminderJob] ❌ Error in sendComplaintReminders:', err.message);
  }
}

// ── Main: Start the cron job ─────────────────────────────────────────────────

/**
 * Starts the reminder cron job.
 * Runs every day at 08:00 AM server local time.
 * Call this once from server.js after DB connection is established.
 */
function startReminderJob() {
  // Cron expression: "0 8 * * *" = at 8:00 AM every day
  cron.schedule('0 8 * * *', async () => {
    console.log('\n[ReminderJob] ⏰ Daily reminder job triggered at', new Date().toISOString());

    await sendApplicationReminders();
    await sendComplaintReminders();

    console.log('[ReminderJob] ✅ Daily reminder job completed.\n');
  });

  console.log('[ReminderJob] 📅 Reminder cron job scheduled (daily at 08:00 AM)');
}

module.exports = { startReminderJob, sendApplicationReminders, sendComplaintReminders };
