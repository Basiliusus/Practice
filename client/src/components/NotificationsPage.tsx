import React from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import type { RootState } from '../redux/store';
import { fetchNotifications } from '../redux/notificationsSlice';

const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);
  const { notifications, error } = useAppSelector((state: RootState) => state.notifications);

  React.useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications(user._id));
    }
  }, [dispatch, user?._id]);

  if (!user?._id) return <div>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Уведомления</h2>
      {/* {loading && <div>Загрузка...</div>} */}
      {error && <div style={{ color: '#dc2626' }}>{error}</div>}
      {notifications.length === 0 && <div>Нет уведомлений</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifications.map(n => (
          <li key={n._id} style={{
            background: n.isRead ? '#f3f4f6' : '#dbeafe',
            borderRadius: 8,
            marginBottom: 12,
            padding: '14px 18px',
            fontWeight: n.isRead ? 400 : 600
          }}>
            <div>{n.message}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage; 