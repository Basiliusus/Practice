
## Описание

Веб-приложение для корпоративной коммуникации: лента постов, вакансий, событий, с поддержкой ролей, регистрации, авторизации и фильтрации. Реализовано на стеке Vite + React + TypeScript + Redux + Node.js + Express + MongoDB.

## Основные возможности

### 🔐 Аутентификация и авторизация
- Регистрация и авторизация с валидацией
- JWT-сессии через HttpOnly cookie
- Роли пользователей: Frontend/Backend Developer, QA Engineer, Designer, Manager, HR

### 📝 Лента постов
- Создание, редактирование, удаление постов (только автор)
- Лайки постов
- Превью-картинка (base64)
- Фильтрация по типу и направлению
- Современный адаптивный UI/UX

### 👤 Профили пользователей
- Детальные профили с аватарами
- Редактирование личной информации
- Загрузка аватаров (с поддержкой изображений)
- Портфолио проектов
- Просмотр профилей других пользователей

### 💼 Портфолио проектов
- Добавление, редактирование, удаление проектов
- Превью-изображения для проектов
- Ссылки на проекты (до 3 ссылок)
- Интерактивные карточки проектов
- Режимы отображения изображений (вписать/заполнить)

### 🎨 UI/UX улучшения
- Современный адаптивный дизайн
- Тёмная тема
- Плавные анимации и переходы
- Модальные окна для подтверждений
- Улучшенная навигация
- Адаптивная верстка для мобильных устройств

### 🔧 Дополнительные функции
- Список всех пользователей
- Уведомления
- Валидация форм
- Обработка ошибок
- Загрузка файлов

## Технологии

### Frontend
- **Vite** — быстрый сборщик
- **React 19** — UI библиотека
- **TypeScript** — типизация
- **Redux Toolkit** — управление состоянием
- **React Router DOM** — маршрутизация
- **SCSS/Sass** — стилизация
- **Axios** — HTTP клиент

### Backend
- **Node.js** — серверная среда
- **Express** — веб-фреймворк
- **MongoDB** — база данных
- **Mongoose** — ODM для MongoDB
- **JWT** — аутентификация
- **bcrypt** — хеширование паролей
- **multer** — загрузка файлов
- **cookie-parser** — работа с cookies
- **cors** — CORS поддержка

### Development
- **ESLint** — линтер
- **Prettier** — форматирование
- **TypeScript ESLint** — линтинг TypeScript
- **Git & GitHub** — версионный контроль

## Быстрый старт

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
cd ВАШ_РЕПОЗИТОРИЙ
```

### 2. Установите зависимости
```bash
# Установка серверных зависимостей
npm install

# Установка клиентских зависимостей
cd client
npm install
```

### 3. Настройте переменные окружения
Создайте `.env` в папке `server`:
```env
MONGO_URI=mongodb://localhost:27017/team-feed
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Запустите MongoDB
- Локально: `mongod`
- Или через MongoDB Compass
- Или используйте MongoDB Atlas (облачная версия)

### 5. Запустите сервер и клиент
В двух терминалах:

**Терминал 1 (сервер):**
```bash
cd server
npm run dev
# или node app.js
```

**Терминал 2 (клиент):**
```bash
cd client
npm run dev
```

- Сервер: http://localhost:5000
- Клиент: http://localhost:5173

## Структура проекта

```
├── client/                 # Frontend приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   │   ├── AuthForm.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostForm.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ProfileEditForm.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── PortfolioBlock.tsx
│   │   │   ├── UsersListPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   └── ...
│   │   ├── redux/         # Redux store и slices
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/                # Backend приложение
│   ├── models/           # Mongoose модели
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Response.js
│   ├── routes/           # Express маршруты
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── responses.js
│   ├── uploads/          # Загруженные файлы
│   ├── app.js
│   └── .env
├── scripts/              # Вспомогательные скрипты
├── package.json
└── README.md
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `POST /api/auth/logout` — выход

### Пользователи
- `GET /api/users` — список всех пользователей
- `GET /api/users/:id` — профиль пользователя
- `PUT /api/users/:id` — обновление профиля
- `POST /api/users/:id/avatar` — загрузка аватара

### Портфолио
- `POST /api/users/:id/portfolio` — добавление проекта
- `PUT /api/users/:id/portfolio/:projectId` — редактирование проекта
- `DELETE /api/users/:id/portfolio/:projectId` — удаление проекта

### Посты
- `GET /api/posts` — получение постов
- `POST /api/posts` — создание поста
- `PUT /api/posts/:id` — редактирование поста
- `DELETE /api/posts/:id` — удаление поста
- `POST /api/posts/:id/like` — лайк поста

## Особенности реализации

### Безопасность
- JWT токены в HttpOnly cookies
- Хеширование паролей с bcrypt
- Валидация данных на сервере
- CORS настройки

### Производительность
- Оптимизированные запросы к MongoDB
- Ленивая загрузка компонентов
- Кэширование в Redux
- Оптимизация изображений

### UX/UI
- Адаптивный дизайн
- Плавные анимации
- Интуитивная навигация
- Обработка состояний загрузки
- Уведомления об ошибках

## Разработка

### Скрипты
```bash
# Клиент
npm run dev          # Запуск dev сервера
npm run build        # Сборка для продакшена
npm run lint         # Линтинг кода
npm run preview      # Предпросмотр сборки

# Сервер
npm run dev          # Запуск с nodemon
node app.js          # Запуск без nodemon
```

### Структура данных

#### Пользователь
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  nickname: String,
  email: String,
  password: String,
  role: String,
  description: String,
  workplace: String,
  avatar: String,
  portfolio: [Project]
}
```

#### Проект
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  links: [String],
  previewImage: String
}
```

#### Пост
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  type: String,
  direction: String,
  author: ObjectId,
  likes: [ObjectId],
  previewImage: String,
  createdAt: Date
}
```

## Автор
- [Basil](https://github.com/Basiliusus)

## Лицензия
ISC

---

## English summary
A corporate feed application with user profiles, portfolio management, post creation, role-based access, and modern UI/UX. Built with Vite, React, TypeScript, Redux, Node.js, Express, and MongoDB. Features include user authentication, profile management, project portfolios, post creation with likes, file uploads, and responsive design. 
