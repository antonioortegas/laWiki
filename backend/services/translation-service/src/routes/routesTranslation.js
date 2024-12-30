const express = require('express');
const router = express.Router();
const { translateText } = require('../controllers/translationController.js');

router.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;
  try {
    const translatedText = await translateText(text, targetLanguage);
    res.json(translatedText);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
