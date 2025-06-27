const mongoose = require('mongoose');
const ResponseSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // кто откликнулся
  createdAt: { type: Date, default: Date.now }
});

// Notification model
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // кому
  type: { type: String, required: true }, // например, 'response'
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  data: { type: Object }, // любые доп. данные (например, postId, authorId)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);
module.exports.Notification = mongoose.model('Notification', NotificationSchema); 