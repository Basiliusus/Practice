const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, nickname, email, password, confirmPassword, role } = req.body;

    // Валидация
    if (!firstName || !lastName || !nickname || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Пароли не совпадают' });
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return res.status(400).json({ message: 'Пароль должен содержать минимум 8 символов, буквы и цифры' });
    }
    // Проверка уникальности
    const existingUser = await User.findOne({ $or: [{ nickname }, { email }] });
    if (existingUser) {
      if (existingUser.nickname === nickname) {
        return res.status(400).json({ message: 'Никнейм уже занят' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email уже занят' });
      }
    }
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, nickname, email, password: hashedPassword, role
    });
    // Генерация JWT
    const token = jwt.sign(
      { id: user._id, nickname: user.nickname, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Установка cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.status(201).json({ message: 'Регистрация успешна', user: { id: user._id, _id: user._id, nickname: user.nickname, role: user.role, token } });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const user = await User.findOne({ nickname });
    if (!user) {
      return res.status(400).json({ message: 'Неверный никнейм или пароль' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный никнейм или пароль' });
    }
    const token = jwt.sign(
      { id: user._id, nickname: user.nickname, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ message: 'Вход успешен', user: { id: user._id, _id: user._id, nickname: user.nickname, role: user.role, token } });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение профиля
router.get('/profile', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Нет авторизации' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Пользователь не найден' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Сессия истекла' });
  }
});

// Выход (logout)
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Выход выполнен' });
});

module.exports = router; 