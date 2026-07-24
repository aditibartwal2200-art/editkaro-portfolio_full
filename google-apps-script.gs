function doPost(e) {
  var params = e.parameter;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (params.form === 'newsletter') {
    var sheet = ss.getSheetByName('Newsletter') || ss.insertSheet('Newsletter');
    if (sheet.getLastRow() === 0) sheet.appendRow(['Timestamp', 'Email', 'Page']);
    sheet.appendRow([params.timestamp || new Date().toISOString(), params.email || '', params.page || '']);
  } else if (params.form === 'contact') {
    var csheet = ss.getSheetByName('Contact') || ss.insertSheet('Contact');
    if (csheet.getLastRow() === 0) csheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Message', 'Page']);
    csheet.appendRow([
      params.timestamp || new Date().toISOString(),
      params.name || '',
      params.email || '',
      params.phone || '',
      params.message || '',
      params.page || ''
    ]);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unknown form' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('Editkaro.in form endpoint is live.');
}
