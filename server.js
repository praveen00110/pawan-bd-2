const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3333;
const DATA_DIR = path.join(__dirname, 'data');
const REPLIES_FILE = path.join(DATA_DIR, 'replies.json');

// Ensure data directory and replies file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(REPLIES_FILE)) {
  fs.writeFileSync(REPLIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API: Save reply
app.post('/api/reply', (req, res) => {
  try {
    const { name, message, reaction, songChoice } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    const newReply = {
      id: Date.now().toString(),
      name: name && name.trim() ? name.trim() : 'Tharushi Vishmika',
      message: message.trim(),
      reaction: reaction || '❤️',
      songChoice: songChoice || 'romantic-hbd',
      createdAt: new Date().toISOString(),
      formattedTime: new Date().toLocaleString()
    };

    let replies = [];
    try {
      const data = fs.readFileSync(REPLIES_FILE, 'utf-8');
      replies = JSON.parse(data);
    } catch (e) {
      replies = [];
    }

    replies.unshift(newReply); // Newest first
    fs.writeFileSync(REPLIES_FILE, JSON.stringify(replies, null, 2), 'utf-8');

    console.log(`[REPLY RECEIVED] From: ${newReply.name} | Reaction: ${newReply.reaction} | Message: ${newReply.message}`);
    return res.json({ success: true, reply: newReply });
  } catch (err) {
    console.error('Error saving reply:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// API: Get all replies
app.get('/api/replies', (req, res) => {
  try {
    const data = fs.readFileSync(REPLIES_FILE, 'utf-8');
    const replies = JSON.parse(data);
    return res.json({ success: true, replies });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to read replies' });
  }
});

// Admin Dashboard to view replies
app.get('/view-replies', (req, res) => {
  try {
    const data = fs.readFileSync(REPLIES_FILE, 'utf-8');
    const replies = JSON.parse(data);

    let cardsHtml = replies.map(r => `
      <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,182,193,0.3); border-radius: 16px; padding: 20px; margin-bottom: 20px; backdrop-filter: blur(10px);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-size: 1.3rem; font-weight: bold; color: #ff8fa3;">${r.reaction} ${r.name}</span>
          <span style="font-size: 0.85rem; color: #cbd5e1;">${r.formattedTime}</span>
        </div>
        <p style="font-size: 1.1rem; line-height: 1.6; color: #fff; margin: 0; white-space: pre-wrap;">${r.message}</p>
      </div>
    `).join('');

    if (replies.length === 0) {
      cardsHtml = `<p style="color: #cbd5e1; text-align: center; padding: 40px;">No replies received yet. Waiting for Tharushi's sweet words! ✨</p>`;
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tharushi's Messages & Replies ❤️</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            background: linear-gradient(135deg, #090a0f 0%, #171026 50%, #2b1028 100%);
            color: #fff;
            font-family: 'Plus Jakarta Sans', sans-serif;
            min-height: 100vh;
            padding: 40px 20px;
            box-sizing: border-box;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
          }
          h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.2rem;
            color: #ffb4c2;
            text-align: center;
            margin-bottom: 8px;
          }
          .sub {
            text-align: center;
            color: #d1d5db;
            margin-bottom: 35px;
            font-size: 0.95rem;
          }
          .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #ff8fa3;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="/" class="back-link">← Back to Birthday Site</a>
          <h1>💌 Tharushi's Heartfelt Replies</h1>
          <p class="sub">All messages sent by Tharushi Vishmika are lovingly preserved here</p>
          ${cardsHtml}
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error loading replies dashboard');
  }
});

// Health check for Railway / cloud monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎉 Tharushi Vishmika's Birthday Site is running on port ${PORT} (0.0.0.0)`);
  console.log(`💌 View replies received at: /view-replies\n`);
});
