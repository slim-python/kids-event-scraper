const { google } = require('googleapis');
const path = require('path');

// Get __filename and __dirname in CommonJS (ES5 style)


// Setup Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


 async function appendEventsToSheet(events) {

  const spreadsheetId = '1fRdvNURaMcu-WMMQZsOwoGSP0Ywi298XumrpRdZXzR4';
//   const range = 'Sheet1'; // Sheet name only, for appending rows
  const range = 'test'; // Sheet name only, for appending rows

  try {
    if (!Array.isArray(events) || events.length === 0) {
      throw new Error('Events array is empty or not valid.');
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const rows = events.map((event) => [
      new Date().toISOString(),
      event.website || 'Macaroni Kid',
      event.title || '',
      event.date || '',
      event.time || '',
      event.location || '',
      event.description || '',
      event.cost || '',
      event.paidOrFree || '',
      event.eventLink || '',
    ]);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: rows,
      },
    });

    console.log(`✅ Successfully appended ${rows.length} rows.`);
    return response.data;
  } catch (error) {
    console.error('❌ Error appending events to sheet:', error.message);
    return null;
  }
}
module.exports = { appendEventsToSheet };