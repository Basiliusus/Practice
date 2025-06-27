const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();
const mongoose = require('mongoose');

// Middleware для проверки авторизации
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Нет авторизации' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Сессия истекла' });
  }
}

// GET /posts?type=&direction=
router.get('/', async (req, res) => {
  try {
    const { type, direction } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (direction) filter.direction = direction;
    const posts = await Post.find(filter)
      .populate('author', 'nickname avatar firstName lastName')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /posts
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content, type, direction, previewImage } = req.body;
    if (!title || !content || !type || !direction) {
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
    }
    if (title.length > 100) {
      return res.status(400).json({ message: 'Заголовок не должен превышать 100 символов' });
    }
    if (content.length > 20000) {
      return res.status(400).json({ message: 'Текст не должен превышать 20000 символов' });
    }
    const post = await Post.create({
      title,
      content,
      type,
      direction,
      previewImage,
      author: req.user.id
    });
    await post.populate('author', 'nickname avatar firstName lastName');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /posts/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на редактирование' });
    }
    const { title, content, type, direction, previewImage } = req.body;
    if (!title || !content || !type || !direction) {
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
    }
    if (title.length > 100) {
      return res.status(400).json({ message: 'Заголовок не должен превышать 100 символов' });
    }
    if (content.length > 20000) {
      return res.status(400).json({ message: 'Текст не должен превышать 20000 символов' });
    }
    post.title = title;
    post.content = content;
    post.type = type;
    post.direction = direction;
    post.previewImage = previewImage;
    await post.save();
    await post.populate('author', 'nickname avatar firstName lastName');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /posts/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }
    await post.deleteOne();
    res.json({ message: 'Пост удалён' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /posts/:id/like
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    if (post.likedBy.includes(req.user.id)) {
      return res.status(400).json({ message: 'Вы уже поставили лайк' });
    }
    post.likedBy.push(req.user.id);
    post.likes = post.likedBy.length;
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /posts/:id/like
router.delete('/:id/like', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    post.likedBy = post.likedBy.filter(
      (userId) => userId.toString() !== req.user.id
    );
    post.likes = post.likedBy.length;
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 