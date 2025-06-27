// Удаляет все проекты без _id из портфолио всех пользователей
const mongoose = require('mongoose');
const path = require('path');
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';

(async () => {
  try {
    // Подключаемся к базе
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
    const User = require(path.join(__dirname, '../server/models/User'));
    const users = await User.find({ 'portfolio._id': { $exists: false } });
    let total = 0;
    for (const user of users) {
      const before = user.portfolio.length;
      user.portfolio = user.portfolio.filter(p => p._id);
      if (user.portfolio.length < before) {
        await user.save();
        total += before - user.portfolio.length;
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('Ошибка:', err);
    process.exit(1);
  }
})(); 