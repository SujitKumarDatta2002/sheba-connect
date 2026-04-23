const axios = require("axios");

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function normalizeDateRange(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate) {
    throw new Error("Valid start and end dates are required in YYYY-MM-DD format");
  }

  if (startDate > endDate) {
    throw new Error("start date must be before or equal to end date");
  }

  return {
    startDate,
    endDate,
    startISO: startDate.toISOString(),
    endISO: new Date(endDate.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
    startDay: startDate.toISOString().slice(0, 10),
    endDay: endDate.toISOString().slice(0, 10),
  };
}

async function fetchGoogleCalendarEvents(startDateISO, endDateISO) {
  const apiKey =
    process.env.GOOGLE_CALENDAR_API_KEY ||
    process.env.VITE_GOOGLE_CALENDAR_API_KEY ||
    "";
  const calendarId =
    process.env.GOOGLE_CALENDAR_ID ||
    process.env.VITE_GOOGLE_CALENDAR_ID ||
    "";

  if (!apiKey || !calendarId) {
    return { enabled: false, events: [], reason: "Google Calendar key/id not configured" };
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events?key=${encodeURIComponent(apiKey)}&timeMin=${encodeURIComponent(
    startDateISO
  )}&timeMax=${encodeURIComponent(endDateISO)}&singleEvents=true&orderBy=startTime&maxResults=250`;

  const response = await axios.get(url, { timeout: 20000 });
  const events = (Array.isArray(response.data?.items) ? response.data.items : []).map((item) => ({
    id: item.id,
    title: item.summary || "Untitled",
    start:
      item.start?.dateTime ||
      item.start?.date ||
      null,
    end:
      item.end?.dateTime ||
      item.end?.date ||
      null,
    status: item.status || "confirmed",
    link: item.htmlLink || null,
  }));

  return { enabled: true, events };
}

module.exports = {
  normalizeDateRange,
  fetchGoogleCalendarEvents,
};
