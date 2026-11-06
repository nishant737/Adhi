/**
 * Aadhi Careers — Google Apps Script
 *
 * Paste this into the Google Sheet: Extensions → Apps Script. Then:
 *   1. Run `setup` once (pick it in the toolbar and press Run) to create the tabs.
 *   2. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 *   3. Copy the Web app URL and set it as NEXT_PUBLIC_SHEET_URL in Vercel.
 *
 * After editing this script, publish a new version: Deploy → Manage deployments → Edit → New version.
 */

const APPLICATIONS = "Applications";
const OPENINGS = "Openings";
const ENQUIRIES = "Enquiries";
const CV_FOLDER = "Aadhi CVs";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_TEXT = 1000; // longest value kept per cell

const APPLICATION_HEADERS = ["Date", "Type", "Role", "Location", "Name", "Phone", "Email", "Experience", "Preferred location", "CV"];
const ENQUIRY_HEADERS = ["Date", "Company", "Name", "Phone", "Email", "Service", "Positions", "Requirements"];
const OPENING_HEADERS = ["Title", "Location", "Region", "Type", "Experience", "Salary", "Active"];

// Creates both tabs with headers (safe to run again; it never deletes data).
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet(ss, APPLICATIONS, APPLICATION_HEADERS);
  ensureSheet(ss, ENQUIRIES, ENQUIRY_HEADERS);
  const openings = ensureSheet(ss, OPENINGS, OPENING_HEADERS);
  if (openings.getLastRow() === 1) {
    openings.getRange(2, 1, 6, OPENING_HEADERS.length).setValues([
      ["Assistant Asset Manager", "Mangalore", "India", "Full-time", "", "₹20,000 – ₹30,000", "Yes"],
      ["Accountant", "India", "India", "Full-time", "", "", "Yes"],
      ["Assistant Store Manager", "India", "India", "Full-time", "", "", "Yes"],
      ["Civil Engineer", "India", "India", "Full-time", "", "", "Yes"],
      ["Caregiver", "Israel", "Abroad", "Full-time", "", "", "Yes"],
      ["Registered Nurse", "Abroad", "Abroad", "Full-time", "", "", "Yes"],
    ]);
  }
  DriveApp.getFoldersByName(CV_FOLDER).hasNext() || DriveApp.createFolder(CV_FOLDER);
}

// Website reads the open jobs from the "Openings" tab.
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OPENINGS);
  if (!sheet || sheet.getLastRow() < 2) return reply({ jobs: [] });
  const [head, ...rows] = sheet.getDataRange().getDisplayValues();
  const keys = head.map((h) => String(h).trim().toLowerCase());
  const jobs = rows
    .map((r) => Object.fromEntries(keys.map((k, i) => [k, String(r[i]).trim()])))
    .filter((j) => j.title && (j.active || "yes").toLowerCase() !== "no");
  return reply({ jobs });
}

// Website sends applications ("application" with a CV) and job requests ("request").
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (!clean(d.name) || !clean(d.phone)) return reply({ ok: false, error: "Name and phone are required" });
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Business enquiries from the Contact section have their own tab
    if (d.kind === "enquiry") {
      ensureSheet(ss, ENQUIRIES, ENQUIRY_HEADERS).appendRow([
        new Date(),
        ...[d.company, d.name, d.phone, d.email, d.service, d.positions, d.message].map(cell),
      ]);
      return reply({ ok: true });
    }

    const sheet = ensureSheet(ss, APPLICATIONS, APPLICATION_HEADERS);

    let cv = "";
    if (d.cv && d.cv.base64) {
      const bytes = Utilities.base64Decode(d.cv.base64);
      if (bytes.length > MAX_BYTES) return reply({ ok: false, error: "File is larger than 5 MB" });
      const okType = CV_TYPES.indexOf(d.cv.type) !== -1 || /\.(pdf|docx?)$/i.test(String(d.cv.name));
      if (!okType) return reply({ ok: false, error: "Only PDF or Word files are accepted" });
      const folders = DriveApp.getFoldersByName(CV_FOLDER);
      const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CV_FOLDER);
      const file = folder.createFile(
        Utilities.newBlob(bytes, d.cv.type || "application/octet-stream", `${clean(d.role) || "CV"} - ${clean(d.name)} - ${clean(d.cv.name)}`)
      );
      cv = file.getUrl();
    }

    const type = d.kind === "request" ? "Job request" : "Job application";
    sheet.appendRow([new Date(), type, ...[d.role, d.location, d.name, d.phone, d.email, d.experience, d.preferredLocation].map(cell), cv]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

// Trims and shortens what visitors typed.
function clean(value) {
  return String(value == null ? "" : value).trim().slice(0, MAX_TEXT);
}

// A cell value from a visitor. Text starting with = + - or @ would run as a formula in
// Sheets, so it gets a leading apostrophe and is always shown as plain text.
function cell(value) {
  const text = clean(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function ensureSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
