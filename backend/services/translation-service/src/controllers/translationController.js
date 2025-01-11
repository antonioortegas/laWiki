const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const translateText = async (text, targetLanguage,fromLanguage) => {
  const subscriptionKey = process.env.KEYAZURE;
  const region=process.env.REGION;
  
  url = `https://api-eur.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${fromLanguage}&to=${targetLanguage}`;
  try {
    const response = await axios.post(
      url,
      [
        { Text: text }, // Text to translate
      ],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  translateText,
};

