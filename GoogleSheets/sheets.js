var google = require('googleapis').google;
var path = require('path');

// Setup Google Auth
var auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

function appendEventsToSheet(events) {
  var spreadsheetId = '1fRdvNURaMcu-WMMQZsOwoGSP0Ywi298XumrpRdZXzR4';
  var range = 'test'; // Sheet name only, for appending rows

  if (!Array.isArray(events) || events.length === 0) {
    return Promise.reject(new Error('Events array is empty or not valid.'));
  }

  return auth.getClient()
    .then(function(client) {
      var sheets = google.sheets({ version: 'v4', auth: client });

      var rows = events.map(function(event) {
        return [
          new Date().toISOString(),
          event.website || 'Macaroni Kid',
          event.title || '',
          event.date || '',
          event.time || '',
          event.location || '',
          event.description || '',
          event.cost || '',
          event.paidOrFree || '',
          event.eventLink || ''
        ];
      });

      return sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: rows
        }
      });
    })
    .then(function(response) {
      console.log('✅ Successfully appended ' + response.data.updates.updatedRows + ' rows.');
      return response.data;
    })
    .catch(function(error) {
      console.error('❌ Error appending events to sheet:', error.message);
      return null;
    });
}

module.exports = {
  appendEventsToSheet: appendEventsToSheet
};

