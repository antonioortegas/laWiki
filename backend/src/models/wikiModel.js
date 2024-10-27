const mongoose = require('mongoose');

const wikiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  categories: {
    type: [String],
    default: [],  // Array of strings for categories/tags
  },
  language: {
    type: String,
    default: 'es',  // Default language is Spanish
  },
});

module.exports = mongoose.model('Wiki', wikiSchema);
