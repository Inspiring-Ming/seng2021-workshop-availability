/**
 * Receives workshop availability answers from the GitHub Pages form and
 * writes them to the Google Sheet this script is attached to.
 * One row per tutor: saving again with the same name replaces that row.
 */

var SHEET_NAME = 'Responses';
var SLOT_KEYS = ['F09A', 'F11A', 'F15A', 'T16A', 'T16B'];
var HEADERS = [
  'Updated', 'Name',
  'F09A Fri 09-11', 'F11A Fri 11-13', 'F15A Fri 15-17', 'T16A Tue 16-18', 'T16B Tue 16-18',
  'Note'
];
var LABELS = { pref: 'Preferred', ok: 'Can do', no: "Can't" };

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse(e.postData.contents);
    var name = String(body.name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    if (!name) return reply({ ok: false, error: 'name required' });

    var row = [new Date(), plain(name)];
    for (var i = 0; i < SLOT_KEYS.length; i++) {
      var label = LABELS[body.slots && body.slots[SLOT_KEYS[i]]];
      if (!label) return reply({ ok: false, error: 'answer every workshop' });
      row.push(label);
    }
    row.push(plain(String(body.note || '').slice(0, 300)));

    lock.waitLock(20000);
    var sheet = getSheet();
    var last = sheet.getLastRow();
    var target = 0;
    if (last > 1) {
      var names = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (var r = 0; r < names.length; r++) {
        if (String(names[r][0]).trim().toLowerCase() === plain(name).toLowerCase()) { target = r + 2; break; }
      }
    }
    if (target) sheet.getRange(target, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
    return reply({ ok: true, updated: !!target });
  } catch (err) {
    return reply({ ok: false, error: 'could not save' });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet() {
  return reply({ ok: true, info: 'Workshop availability endpoint is running.' });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Stops typed text being treated as a spreadsheet formula. */
function plain(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
