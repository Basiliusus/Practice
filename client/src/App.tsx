import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchProfile, logoutAsync } from './redux/userSlice';
import AuthForm from './components/AuthForm';
import type { RootState } from './redux/store';

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  // Функции для проверки ролей
  const canCreatePosts = [
    'Frontend Developer',
    'Backend Developer',
    'QA Engineer',
    'Designer',
    'HR',
    'Manager'
  ].includes(user?.role || '');

  const isHR = user?.role === 'HR';
  const isManager = user?.role === 'Manager';

  return (
    <div className="main-page">
      <h1>Добро пожаловать, {user?.nickname}!</h1>
      <p>Ваша роль: {user?.role}</p>
      <button className="main-btn" onClick={() => dispatch(logoutAsync())}>Выйти</button>

      {/* Доступно всем этим ролям */}
      {canCreatePosts && (
        <div>
          <button className="action-btn">Создать пост</button>
          <button className="action-btn">Добавить проект в портфолио</button>
          <button className="action-btn">Откликнуться на вакансию</button>
        </div>
      )}

      {/* Только для HR */}
      {isHR && (
        <div>
          <button className="action-btn">Создать вакансию</button>
          <button className="action-btn">Управлять командами</button>
          <button className="action-btn">Пригласить пользователя в компанию</button>
        </div>
      )}

      {/* Только для Manager */}
      {isManager && (
        <div>
          <button className="action-btn">Управлять командами</button>
          <button className="action-btn">Управлять проектами</button>
        </div>
      )}
    </div>
  );
};

export default App;
