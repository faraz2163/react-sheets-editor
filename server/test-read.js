const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json", 
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const spreadsheetId = "1_LSiD3swkfgT3hEWpIZ4gsL_P7VcB4rYfYfM40EHuVA"; // replace with real ID

async function readSheet() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "STD!A1:F10", // tab name + range
  });

  console.log("Data from STD tab:");
  console.log(res.data.values);
}

readSheet().catch(err => console.error("Error:", err));