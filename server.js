// ============================================================
//  CosPlix – Local Development Server (Node.js / Express)
//  Usage: node server.js
//  Opens: http://localhost:3000
// ============================================================

const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

// Serve everything in the current directory as static files
app.use(express.static(path.join(__dirname)));

// Fallback: send index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CosPlix running at http://localhost:${PORT}`);
});
