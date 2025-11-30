const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // Add axios for making HTTP requests

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend if you build one to ./build
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Simple POST /api/chat -> mock AI reply
app.post('/api/chat', (req, res) => {
  try {
    const { model, messages } = req.body || {};
    // Basic safety: don't crash on missing data
    const lastUser = Array.isArray(messages)
      ? [...messages].reverse().find(m => m.role === 'user')
      : null;

    const userText = lastUser ? lastUser.content : '';

    // Example simple response: echo back or canned message
    const replyText =
      userText && userText.trim().length > 0
        ? `Received your message: "${userText}". (This is a mock response from the local server.)`
        : 'Hello from mock AI server. Send a message in "messages".';

    return res.json({
      message: {
        content: replyText
      },
      model: model || 'mock-model'
    });
  } catch (err) {
    console.error('Error in /api/chat', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload endpoint (optional) - saves to ./uploads and returns metadata
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safe);
  }
});
const upload = multer({ storage });

app.post('/api/upload', upload.array('files', 10), async (req, res) => {
  try {
    const files = [];
    for (const file of req.files || []) {
      // Send the file to the malware-check service
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.path));

      const response = await axios.post('https://malware-check.amplfy.com/analyze', formData, {
        headers: formData.getHeaders(),
      });

      // Check if the malware-check service detected malware
      if (response.data.success !== true) {
        // Delete the file if malware is detected
        fs.unlinkSync(file.path);
        return res.status(400).json({ error: `Malware detected in file: ${file.originalname}` });
      }

      // If no malware, add file metadata to the response
      files.push({
        originalName: file.originalname,
        savedName: file.filename,
        size: file.size,
        mimeType: file.mimetype,
        url: `/uploads/${file.filename}`,
      });
    }

    return res.json({ files });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
