const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const { Notification } = require('../models/Response');
const Post = require('../models/Post');

// Откликнуться на вакансию
router.post('/', async (req, res) => {
  try {
    const { postId, authorId } = req.body;
    const response = await Response.create({ postId, authorId });
    // Найти пост и автора
    const post = await Post.findById(postId).populate('author', 'nickname');
    if (post && post.author && post.author._id.toString() !== authorId) {
      // Создать уведомление для автора вакансии
      await Notification.create({
        userId: post.author._id,
        type: 'response',
        message: `Новый отклик на вашу вакансию "${post.title}"`,
        data: { postId, responseId: response._id, fromUserId: authorId },
      });
    }
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Получить отклики для пользователя (автора вакансии)
router.get('/for-user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId });
    const postIds = posts.map(p => p._id);
    const responses = await Response.find({ postId: { $in: postIds } }).populate('authorId', 'firstName lastName nickname');
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Получить уведомления для пользователя
router.get('/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 