/**
 * ProLedge — Waitlist → Google Sheet
 * Receives email signups from the launching-soon page and appends a row.
 *
 * ── SETUP (one time) ──────────────────────────────────────────────
 * 1. Create a Google Sheet (e.g. "ProLedge Waitlist").
 * 2. In the Sheet:  Extensions ▸ Apps Script.
 * 3. Delete any sample code, paste THIS whole file, and Save.
 * 4. Click Deploy ▸ New deployment ▸ type "Web app".
 *      - Description: ProLedge waitlist
 *      - Execute as:  Me
 *      - Who has access:  Anyone
 *    Click Deploy, then Authorize access (allow your own account).
 * 5. Copy the Web app URL (it ends with /exec).
 * 6. Open index.html and set:  const SHEET_ENDPOINT = '<that URL>';
 *
 * To export the emails: in the Sheet, File ▸ Download ▸ Microsoft Excel (.xlsx).
 * ──────────────────────────────────────────────────────────────────
 */

// Optional: lock this to a specific tab name. Leave '' to use the first sheet.
var SHEET_NAME = '';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // avoid two submissions colliding
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];

    // Ensure the header row exists AND is up to date (auto-upgrades older email-only sheets).
    var HEADER = ['Timestamp', 'Name', 'Email', 'Country Code', 'Mobile', 'Education', 'Source', 'Page', 'User Agent'];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER);
    } else {
      var firstRow = sheet.getRange(1, 1, 1, HEADER.length).getValues()[0];
      if (String(firstRow[1] || '') !== 'Name' || String(firstRow[3] || '') !== 'Country Code') {
        sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
      }
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = {}; }
    }
    // also support normal form posts
    if (e && e.parameter && e.parameter.email && !data.email) { data = e.parameter; }

    var email = (data.email || '').toString().trim();
    if (!email) {
      return json({ result: 'error', message: 'no email' });
    }

    // Skip duplicates (case-insensitive). Email lives in column 3.
    var existing = sheet.getLastRow() > 1
      ? sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().map(function (r) {
          return (r[0] || '').toString().trim().toLowerCase();
        })
      : [];
    if (existing.indexOf(email.toLowerCase()) === -1) {
      sheet.appendRow([
        new Date(),
        data.name || '',
        email,
        data.countryCode || '',
        data.mobile || '',
        data.education || '',
        data.source || '',
        data.page || '',
        data.userAgent || ''
      ]);
    }

    return json({ result: 'success', email: email });
  } catch (err) {
    return json({ result: 'error', message: err.message });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to confirm it's live.
function doGet() {
  return json({ result: 'ok', version: 'v2', message: 'ProLedge endpoint live — v2 (name, country code, mobile, education).' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
