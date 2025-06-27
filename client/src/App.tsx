import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import AuthForm from './components/AuthForm';
import ProfilePage from './components/ProfilePage';
import { useParams } from 'react-router-dom';
import UsersListPage from './components/UsersListPage';
import NotificationsPage from './components/NotificationsPage';
import { selectUnreadCount, fetchNotifications } from './redux/notificationsSlice';
import { fetchProfile } from './redux/userSlice';

// Вынесенный основной функционал постов
import AppMain from './AppMain.tsx';

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading, initialized } = useAppSelector(state => state.user);
  const unreadCount = useAppSelector(selectUnreadCount);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchNotifications(user._id));
    }
  }, [dispatch, user && user._id]);

  if (!initialized) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 20 }}>Загрузка приложения...</div>;
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <Router>
      <nav style={{ margin: '1rem' }}>
        <Link to="/">Главная</Link>
        <Link to="/users" style={{ marginLeft: 16 }}>Пользователи</Link>
        {user && (
          <>
            <Link to="/notifications" style={{ marginLeft: 16, position: 'relative', display: 'inline-block' }}>
              Уведомления
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -7,
                  right: -10,
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '50%',
                  minWidth: 16,
                  height: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  boxShadow: '0 1px 4px #0002',
                  padding: '0 3px',
                  zIndex: 1
                }}>{unreadCount}</span>
              )}
            </Link>
          </>
        )}
        {user && user._id && (
          <>
            {' | '}
            <Link to={`/profile/${user._id}`}>Мой профиль</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<AppMain />} />
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile/:id" element={<ProfilePageWrapper />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function ProfilePageWrapper() {
  const { id } = useParams();
  if (!id || id === 'undefined') return <div>Нет id пользователя</div>;
  return <ProfilePage userId={id} />;
}

export default App;
