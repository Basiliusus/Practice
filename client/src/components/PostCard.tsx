import React, { useState } from 'react';
import { likePost, unlikePost } from '../redux/postsSlice';
import type { Post } from '../redux/postsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import type { RootState } from '../redux/store';
import axios from 'axios';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);
  const [expanded, setExpanded] = useState(false);
  const isAuthor = user && (typeof post.author === 'object' ? post.author._id : post.author) === user._id;
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [responded, setResponded] = useState(false);
  const [respondError, setRespondError] = useState<string | null>(null);
  const isManagerOrHR = user?.role === 'Manager' || user?.role === 'HR';
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('contain');

  const handleLike = () => {
    if (post.isLikedByUser) {
      dispatch(unlikePost(post.id));
    } else {
      dispatch(likePost(post.id));
    }
  };

  const handleRespond = async () => {
    setRespondError(null);
    if (!user) {
      setRespondError('Необходима авторизация');
      return;
    }
    if (!isManagerOrHR) {
      setRespondError('Откликаться могут только менеджеры и HR');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/responses', {
        postId: post.id,
        authorId: user._id
      }, { withCredentials: true });
      setResponded(true);
      setShowRespondModal(false);
    } catch (err: any) {
      setRespondError(err.response?.data?.message || 'Ошибка при отклике');
    }
  };

  const previewText = post.content.length > 500 && !expanded
    ? post.content.slice(0, 500) + '...'
    : post.content;

  return (
    <div className="post-card">
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <span className="post-type" style={{
          display: 'inline-block',
          background: post.type === 'Вакансия' ? '#fbbf24' : post.type === 'Событие' ? '#38bdf8' : '#a7f3d0',
          color: '#222',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          padding: '4px 12px',
          marginLeft: 12,
          letterSpacing: 0.5,
          boxShadow: '0 1px 4px #0001',
        }}>{post.type}</span>
      </div>
      <div className="post-meta">
        <span className="post-author" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {typeof post.author === 'object' && post.author.avatar ? (
            <img src={post.author.avatar.startsWith('/uploads/') ? `http://localhost:5000${post.author.avatar}` : post.author.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', background: '#f3f4f6' }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563eb', fontSize: 16 }}>
              {typeof post.author === 'object'
                ? `${post.author.firstName ? post.author.firstName[0] : ''}${post.author.lastName ? post.author.lastName[0] : ''}`
                : ''}
            </div>
          )}
          Автор: <a href="#">{typeof post.author === 'object' ? post.author.nickname : post.author}</a>
        </span>
        <span className="post-direction">Направление: {post.direction}</span>
      </div>
      {post.previewImage && (
        <div style={{ position: 'relative' }}>
          <img
            className="post-preview-image"
            src={post.previewImage}
            alt="Превью"
            style={{ width: '100%', maxHeight: 220, borderRadius: 10, marginBottom: 12, objectFit: fitMode, background: '#f3f4f6' }}
          />
          <button
            type="button"
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 13,
              cursor: 'pointer',
              opacity: 0.85,
              zIndex: 2,
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={fitMode === 'cover' ? 'Вписать' : 'Заполнить'}
            onClick={e => {
              e.stopPropagation();
              setFitMode(fitMode === 'cover' ? 'contain' : 'cover');
            }}
          >
            {fitMode === 'cover' ? (
              // Вписать (arrows)
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8V3H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 12V17H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 3L9 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 17L11 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              // Заполнить (crop)
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="12" height="12" rx="3" stroke="white" strokeWidth="2"/>
                <rect x="7" y="7" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.2"/>
              </svg>
            )}
          </button>
        </div>
      )}
      <div className="post-content">
        {previewText}
        {post.content.length > 500 && !expanded && (
          <button className="expand-btn" onClick={() => setExpanded(true)}>Развернуть</button>
        )}
        {expanded && (
          <button className="expand-btn" onClick={() => setExpanded(false)}>Свернуть</button>
        )}
      </div>
      <div className="post-actions">
        <button className={post.isLikedByUser ? 'like-btn liked' : 'like-btn'} onClick={handleLike}>
          {post.isLikedByUser ? '❤️' : '🤍'} {post.likes}
        </button>
        {isAuthor && (
          <>
            <button className="edit-btn" onClick={() => onEdit(post)}>Редактировать</button>
            <button className="delete-btn" onClick={() => onDelete(post)}>Удалить</button>
          </>
        )}
        {post.type === 'Вакансия' && isManagerOrHR && (
          <button
            className="action-btn"
            style={{ minWidth: 120, padding: '8px 14px', fontSize: 15 }}
            onClick={() => setShowRespondModal(true)}
          >
            Откликнуться на вакансию
          </button>
        )}
      </div>
      {responded && (
        <div style={{
          background: "#d1fae5",
          color: "#065f46",
          borderRadius: 8,
          padding: "10px 14px",
          margin: "14px 0 0 0",
          fontWeight: 600
        }}>
          Вы успешно откликнулись на вакансию!
        </div>
      )}
      {showRespondModal && (
        <div className="modal-overlay">
          <div className="modal-window">
            <h3>Откликнуться на вакансию?</h3>
            {respondError && <div style={{ color: '#dc2626', marginBottom: 10 }}>{respondError}</div>}
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <button
                className="main-btn"
                onClick={handleRespond}
              >
                Да, откликнуться
              </button>
              <button
                className="action-btn"
                style={{ background: '#e5e7eb', color: '#222' }}
                onClick={() => setShowRespondModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard; 