// server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Environment configuration
const PORT = process.env.PORT || 4000;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || "1_LSiD3swkfgT3hEWpIZ4gsL_P7VcB4rYfYfM40EHuVA";

// Google Auth configuration with environment variable support
let auth;
try {
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    // Use environment variable for credentials
    console.log("🔐 Using Google Sheets credentials from environment variable");
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use GOOGLE_APPLICATION_CREDENTIALS environment variable
    console.log("🔐 Using Google Sheets credentials from GOOGLE_APPLICATION_CREDENTIALS");
    auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  } else {
    // Fallback to local service_account.json file
    const serviceAccountPath = path.join(__dirname, "service_account.json");
    if (fs.existsSync(serviceAccountPath)) {
      console.log("🔐 Using Google Sheets credentials from service_account.json file");
      auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountPath,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } else {
      throw new Error("No Google Sheets credentials found. Please set GOOGLE_SHEETS_CREDENTIALS environment variable or provide service_account.json file.");
    }
  }
} catch (error) {
  console.error("❌ Failed to initialize Google Auth:", error.message);
  console.error("Please check your credentials configuration.");
  process.exit(1);
}

// Enhanced cache with better TTL management
const cache = new Map();
const setCache = (k, v) => { 
  cache.set(k, { v, t: Date.now() }); 
  // Clean up old cache entries
  if (cache.size > 1000) {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now - value.t > 30000) { // 30 seconds TTL
        cache.delete(key);
      }
    }
  }
};
const getCache = (k, ttlMs=15000) => {
  const hit = cache.get(k);
  return hit && Date.now() - hit.t < ttlMs ? hit.v : null;
};

// Validate column format (A, B, C, etc.)
const isValidColumn = (col) => /^[A-Z]+$/.test(col);

// Convert column letter to index (A=0, B=1, etc.)
const columnToIndex = (col) => {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 64);
  }
  return result - 1;
};

// Convert index to column letter (0=A, 1=B, etc.)
const indexToColumn = (index) => {
  let result = '';
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
};

// Configuration endpoint to show current settings
app.get("/config", (req, res) => {
  res.json({
    spreadsheetId: SPREADSHEET_ID,
    authMethod: process.env.GOOGLE_SHEETS_CREDENTIALS ? "environment_variable" : 
                 process.env.GOOGLE_APPLICATION_CREDENTIALS ? "application_credentials" : "service_account_file",
    port: PORT,
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/tabs", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: "sheets(properties(title,gridProperties(rowCount,columnCount)))",
    });
    res.json(
      meta.data.sheets.map(s => ({
        title: s.properties.title,
        rows: s.properties.gridProperties?.rowCount || 0,
        cols: s.properties.gridProperties?.columnCount || 0,
      }))
    );
  } catch (error) {
    console.error('Error fetching tabs:', error);
    res.status(500).json({ error: 'Failed to fetch tabs', details: error.message });
  }
});

// GET /sheet/:tab?start=1&limit=500&cols=A:F
app.get("/sheet/:tab", async (req, res) => {
  try {
    const { tab } = req.params;
    const start = Math.max(parseInt(req.query.start || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "500", 10), 2000); // safety cap
    const cols = (req.query.cols || "A:Z").toUpperCase();

    // Validate column format
    if (!cols.includes(':') || cols.split(':').length !== 2) {
      return res.status(400).json({ error: 'Invalid column format. Use format like A:Z or A:F' });
    }

    const [firstCol, lastCol] = cols.split(':');
    if (!isValidColumn(firstCol) || !isValidColumn(lastCol)) {
      return res.status(400).json({ error: 'Invalid column format. Columns must be A-Z format' });
    }

    const end = start + limit - 1;
    const range = `${tab}!${firstCol}${start}:${lastCol}${end}`;

    const key = `${range}`;
    const cached = getCache(key);
    if (cached) return res.json({ range, start, limit, values: cached });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    const resp = await sheets.spreadsheets.values.get({ 
      spreadsheetId: SPREADSHEET_ID, 
      range 
    });
    const values = resp.data.values || [];
    setCache(key, values);
    res.json({ range, start, limit, values });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    res.status(500).json({ error: 'Failed to fetch sheet data', details: error.message });
  }
});

// POST /sheet/:tab/batch
// body: { writes: [{row: 10, col: "D", value: "5200"}, ...] }
app.post("/sheet/:tab/batch", async (req, res) => {
  try {
    const { tab } = req.params;
    const writes = Array.isArray(req.body.writes) ? req.body.writes : [];
    
    if (!writes.length) {
      return res.json({ updated: 0, message: 'No writes to process' });
    }

    // Validate writes
    const validWrites = writes.filter(w => {
      if (!w.row || !w.col || w.value === undefined) {
        console.warn('Invalid write:', w);
        return false;
      }
      if (!isValidColumn(w.col)) {
        console.warn('Invalid column format:', w.col);
        return false;
      }
      if (w.row < 1) {
        console.warn('Invalid row number:', w.row);
        return false;
      }
      return true;
    });

    if (validWrites.length !== writes.length) {
      console.warn(`Filtered out ${writes.length - validWrites.length} invalid writes`);
    }

    if (!validWrites.length) {
      return res.status(400).json({ error: 'No valid writes to process' });
    }

    const data = validWrites.map(w => ({
      range: `${tab}!${w.col}${w.row}`,
      values: [[w.value]],
    }));

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "RAW",
        data,
      },
    });

    // Invalidate overlapping cache windows for this tab
    for (const [k] of cache) if (k.startsWith(`${tab}!`)) cache.delete(k);

    res.json({ 
      updated: result.data.totalUpdatedCells || validWrites.length,
      message: `Successfully updated ${result.data.totalUpdatedCells || validWrites.length} cells`,
      writes: validWrites
    });
  } catch (error) {
    console.error('Error updating sheet:', error);
    res.status(500).json({ error: 'Failed to update sheet', details: error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    auth: auth ? "configured" : "not_configured",
    spreadsheet: SPREADSHEET_ID ? "configured" : "not_configured"
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log(`🔐 Auth method: ${process.env.GOOGLE_SHEETS_CREDENTIALS ? 'Environment Variable' : 
               process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'Application Credentials' : 'Service Account File'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

