const { google } = require('googleapis');

// This function creates a calendar event using Google Calendar API.
// Note: You must set up OAuth2 authentication for production use.
exports.createEvent = async (auth, eventData) => {
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: eventData,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};
