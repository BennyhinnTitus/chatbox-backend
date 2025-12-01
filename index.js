const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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

// Routes
const chatRoutes = require('./src/routes/chatRoute');
const uploadRoutes = require('./src/routes/uploadRoute');
const healthRoutes = require('./src/routes/healthRoute');

app.use('/api', chatRoutes);
app.use('/api', uploadRoutes);
app.use('/api', healthRoutes);

// Serve uploaded files statically
const uploadsDir = path.join('/tmp', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
