
## Описание

Веб-приложение для корпоративной коммуникации: лента постов, вакансий, событий, с поддержкой ролей, регистрации, авторизации и фильтрации. Реализовано на стеке Vite + React + TypeScript + Redux + Node.js + Express + MongoDB.

## Основные возможности
- Регистрация и авторизация с валидацией
- JWT-сессии через HttpOnly cookie
- Роли пользователей: Frontend/Backend Developer, QA Engineer, Designer, Manager, HR
- Лента постов с фильтрацией по типу и направлению
- Создание, редактирование, удаление постов (только автор)
- Лайки постов
- Превью-картинка (base64)
- Современный адаптивный UI/UX, тёмная тема, анимации

## Технологии
- **Frontend:** Vite, React, TypeScript, Redux Toolkit, SCSS/CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Dev:** ESLint, Prettier, Git, GitHub


## Быстрый старт

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
cd ВАШ_РЕПОЗИТОРИЙ
```

### 2. Установите зависимости
```bash
cd server
npm install
cd ../client
npm install
```

### 3. Настройте переменные окружения
Создайте `.env` в папке `server`:
```
MONGO_URI=mongodb://localhost:27017/team-feed
JWT_SECRET=your_jwt_secret
```

### 4. Запустите MongoDB
- Локально: `mongod`
- Или через MongoDB Compass

### 5. Запустите сервер и клиент
В двух терминалах:
```bash
cd server
npm run dev
# или node app.js
```
```bash
cd client
npm run dev
```

- Сервер: http://localhost:5000
- Клиент: http://localhost:5173

---

## Структура проекта
```
server/
  models/
  routes/
  app.js
  .env
client/
  src/
    components/
    redux/
    App.tsx
    index.css
  vite.config.ts
README.md
```

---

## Пример .env (server/.env)
```
MONGO_URI=mongodb://localhost:27017/team-feed
JWT_SECRET=your_jwt_secret
```

---

## Автор
- [Basil](https://github.com/Basiliusus)

---

## English summary
A corporate feed app with roles, posts, jobs, events, likes, and modern UI. Stack: Vite, React, TypeScript, Redux, Node.js, Express, MongoDB. 
