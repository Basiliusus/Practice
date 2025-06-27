const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${req.params.id}_${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// Получить профиль пользователя
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновить профиль пользователя
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, nickname, role, description, workplace, avatar } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }
    // Проверка уникальности nickname
    const existing = await User.findOne({ nickname, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ message: 'Nickname already taken' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, nickname, role, description, workplace, avatar },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Добавить проект в портфолио
router.post('/:id/portfolio', async (req, res) => {
  try {
    const { title, description, links, previewImage } = req.body;
    if (!title || title.length > 100) {
      return res.status(400).json({ message: 'Title is required and must be <= 100 chars' });
    }
    if (links && links.length > 3) {
      return res.status(400).json({ message: 'No more than 3 links allowed' });
    }
    if (links && !links.every(l => /^https?:\/\//.test(l))) {
      return res.status(400).json({ message: 'Invalid link format' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newProject = { title, description, links, previewImage };
    user.portfolio.push(newProject);
    try {
      await user.save();
    } catch (err) {
      console.error('Ошибка при сохранении пользователя (добавление проекта):', err);
      return res.status(500).json({ message: err.message || 'Server error' });
    }
    res.json(user.portfolio[user.portfolio.length - 1]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Редактировать проект в портфолио
router.put('/:id/portfolio/:projectId', async (req, res) => {
  try {
    const { title, description, links, previewImage } = req.body;
    if (!title || title.length > 100) {
      return res.status(400).json({ message: 'Title is required and must be <= 100 chars' });
    }
    if (links && links.length > 3) {
      return res.status(400).json({ message: 'No more than 3 links allowed' });
    }
    if (links && !links.every(l => /^https?:\/\//.test(l))) {
      return res.status(400).json({ message: 'Invalid link format' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const project = user.portfolio.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.title = title;
    project.description = description;
    project.links = links;
    project.previewImage = previewImage;
    try {
      await user.save();
    } catch (err) {
      console.error('Ошибка при сохранении пользователя (редактирование проекта):', err);
      return res.status(500).json({ message: err.message || 'Server error' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Удалить проект из портфолио
router.delete('/:id/portfolio/:projectId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Удаляем через splice по индексу
    const projectIndex = user.portfolio.findIndex(
      p => String(p._id) === String(req.params.projectId)
    );
    if (projectIndex !== -1) {
      user.portfolio.splice(projectIndex, 1);
      await user.save();
      return res.json({ message: 'Project deleted' });
    }

    // Старый способ — по title (для старых проектов)
    if (req.body && req.body.title) {
      const oldLen = user.portfolio.length;
      user.portfolio = user.portfolio.filter(
        p => !(p._id == null && p.title === req.body.title)
      );
      if (user.portfolio.length < oldLen) {
        await user.save();
        return res.json({ message: 'Project deleted by title' });
      }
    }

    return res.status(404).json({ message: 'Project not found (нет _id и не совпал title)' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Удалить проект по title (для старых проектов без _id)
router.post('/:id/portfolio/deleteByTitle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const before = user.portfolio.length;
    user.portfolio = user.portfolio.filter(p => p.title !== title);
    if (user.portfolio.length === before) {
      return res.status(404).json({ message: 'Project not found by title' });
    }
    await user.save();
    res.json({ message: 'Project deleted by title' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Получить список всех пользователей (только основные данные)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName nickname role _id avatar');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Загрузка аватара
router.post('/:id/avatar', upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const avatarUrl = `/uploads/${req.file.filename}`;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { avatar: avatarUrl }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 