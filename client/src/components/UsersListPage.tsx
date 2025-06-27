import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../redux/usersListSlice";
import type { RootState } from "../redux/store";
import { Link } from "react-router-dom";

const UsersListPage: React.FC = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.usersList);

  useEffect(() => {
    dispatch(fetchUsersList() as any);
  }, [dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2>Пользователи</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map(user => (
          <li key={user._id} style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(60,60,120,0.08)",
            marginBottom: 14,
            padding: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {user.avatar ? (
                <img src={user.avatar.startsWith('/uploads/') ? `http://localhost:5000${user.avatar}` : user.avatar} alt="avatar" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', background: '#f3f4f6' }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563eb', fontSize: 20 }}>
                  {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                </div>
              )}
              <div>
                <b>{user.firstName} {user.lastName}</b> <span style={{ color: "#64748b" }}>@{user.nickname}</span>
                <div style={{ color: "#2563eb", fontWeight: 500 }}>{user.role}</div>
              </div>
            </div>
            <Link to={`/profile/${user._id}`} style={{
              background: "#2563eb",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 16px",
              textDecoration: "none",
              fontWeight: 600
            }}>
              Профиль
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersListPage; 