const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const translateText = async (text, targetLanguage) => {
  const apiKey = process.env.APILAYER_KEY; // Reemplaza con tu API key real
  try {
    const response = await axios.post('https://api.apilayer.com/translate', {
      text: text,
      target: targetLanguage,
    }, {
      headers: {
        'apikey': apiKey
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  translateText,
};

