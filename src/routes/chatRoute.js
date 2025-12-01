const express = require('express');
const router = express.Router();

// Simple POST /api/chat -> mock AI reply
router.post('/chat', (req, res) => {
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

module.exports = router;