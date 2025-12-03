const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./src/config/mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static build serving
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Routes
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatbotRoutes');
const complaintRoutes = require('./src/routes/complaintRoutes');
// const uploadRoutes = require('./src/routes/uploadRoute');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/complaint', complaintRoutes);
// app.use('/api/upload', uploadRoutes);

// Serve uploads
// Serve uploads
const uploadsDir = path.join(__dirname, 'uploads');   // ✅ FIX
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));



// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to launch server because DB failed.');
    console.error(err);
    process.exit(1);
  });

