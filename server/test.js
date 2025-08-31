const { google } = require("googleapis");

// 1. Load service account key
const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json", // path to the JSON you downloaded
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

// 2. Spreadsheet ID (from the sheet’s URL)
const spreadsheetId = "1_LSiD3swkfgT3hEWpIZ4gsL_P7VcB4rYfYfM40EHuVA"; 
// Example URL: https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQRstuVWxyz1234567/edit#gid=0
// Spreadsheet ID is the part between `/d/` and `/edit`.

async function readSheet() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A1:D10", // adjust to your sheet name & range
  });

  console.log("Sheet Data:");
  console.log(res.data.values);
}

readSheet().catch(err => console.error("Error:", err));