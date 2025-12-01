const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// File upload endpoint (optional) - saves to /tmp/uploads and returns metadata
const uploadsDir = path.join('/tmp', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safe);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.array('files', 10), (req, res) => {
  try {
    const files = (req.files || []).map(f => ({
      originalName: f.originalname,
      savedName: f.filename,
      size: f.size,
      mimeType: f.mimetype,
      url: `/uploads/${f.filename}`
    }));
    return res.json({ files });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;