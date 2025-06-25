import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchProfile, logoutAsync } from './redux/userSlice';
import { fetchPosts, deletePost } from './redux/postsSlice';
import AuthForm from './components/AuthForm';
import PostCard from './components/PostCard';
import PostForm from './components/PostForm';
import ConfirmationModal from './components/ConfirmationModal';
import FilterBar from './components/FilterBar';
import type { RootState } from './redux/store';
import type { Post } from './redux/postsSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.user);
  const { posts, loading, filter } = useAppSelector((state: RootState) => state.posts);

  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [typeFilter, setTypeFilter] = useState(filter.type || '');
  const [directionFilter, setDirectionFilter] = useState(filter.direction || '');

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPosts({ type: typeFilter, direction: directionFilter }));
    }
  }, [dispatch, isAuthenticated, typeFilter, directionFilter]);

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

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  const handleDelete = (post: Post) => {
    setPostToDelete(post);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      await dispatch(deletePost(postToDelete.id));
      setShowConfirm(false);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPostToDelete(null);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setShowPostForm(true);
  };

  const handleCloseForm = () => {
    setEditingPost(null);
    setShowPostForm(false);
  };

  return (
    <div className="main-page">
      <h1>Добро пожаловать, {user?.nickname}!</h1>
      <p>Ваша роль: {user?.role}</p>
      <button className="main-btn" onClick={() => dispatch(logoutAsync())}>Выйти</button>

      {/* Доступно всем этим ролям */}
      {canCreatePosts && (
        <div>
          <button className="action-btn" onClick={handleCreate}>Создать пост</button>
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

      {/* Фильтры и лента постов */}
      <FilterBar
        type={typeFilter}
        direction={directionFilter}
        onTypeChange={setTypeFilter}
        onDirectionChange={setDirectionFilter}
      />
      {loading ? (
        <div>Загрузка постов...</div>
      ) : (
        <div className="posts-list">
          {posts.length === 0 ? (
            <div>Постов нет</div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      {/* Модалка создания/редактирования поста */}
      {showPostForm && (
        <div className="modal-overlay">
          <div className="modal-window">
            <PostForm initialData={editingPost || undefined} onClose={handleCloseForm} />
          </div>
        </div>
      )}

      {/* Модалка подтверждения удаления */}
      {showConfirm && postToDelete && (
        <ConfirmationModal
          message={`Удалить пост "${postToDelete.title}"? Это действие нельзя отменить.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default App;
