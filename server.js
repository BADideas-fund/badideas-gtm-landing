const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Version A
app.get('/a', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'version-a.html'));
});

// Version B
app.get('/b', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'version-b.html'));
});

// Feedback overlay variants
app.get('/a/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'version-a.html'));
});
app.get('/b/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'version-b.html'));
});

// Form submission endpoint (stores in memory, forwards to webhook if configured)
const submissions = [];
app.post('/api/submit', (req, res) => {
  const { email, version, lid, timestamp } = req.body;
  const entry = { email, version, lid: lid || null, timestamp: timestamp || new Date().toISOString(), ip: req.ip };
  submissions.push(entry);
  console.log('[SUBMISSION]', JSON.stringify(entry));

  // Forward to webhook if configured
  const WEBHOOK_URL = process.env.WEBHOOK_URL;
  if (WEBHOOK_URL) {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(err => console.error('[WEBHOOK ERROR]', err.message));
  }

  res.json({ success: true });
});

// Feedback comment endpoint
const feedbacks = [];
app.post('/api/feedback', (req, res) => {
  const { version, section, comment, author, timestamp } = req.body;
  const entry = { version, section, comment, author: author || 'anonymous', timestamp: timestamp || new Date().toISOString() };
  feedbacks.push(entry);
  console.log('[FEEDBACK]', JSON.stringify(entry));

  const WEBHOOK_URL = process.env.FEEDBACK_WEBHOOK_URL;
  if (WEBHOOK_URL) {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(err => console.error('[FEEDBACK WEBHOOK ERROR]', err.message));
  }

  res.json({ success: true });
});

// Admin endpoint to view submissions (basic, no auth for now)
app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});
app.get('/api/feedbacks', (req, res) => {
  res.json(feedbacks);
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/a');
});

app.listen(PORT, () => {
  console.log(`BADideas GTM landing running on port ${PORT}`);
});
