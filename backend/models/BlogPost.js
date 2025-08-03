const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // HTML content from editor
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  published: { type: Boolean, default: false }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
