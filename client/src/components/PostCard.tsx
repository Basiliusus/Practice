import React, { useState } from 'react';
import { likePost, unlikePost, deletePost } from '../redux/postsSlice';
import type { Post } from '../redux/postsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import type { RootState } from '../redux/store';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);
  const [expanded, setExpanded] = useState(false);
  const isAuthor = user && (typeof post.author === 'object' ? post.author._id : post.author) === user.id;

  const handleLike = () => {
    if (post.isLikedByUser) {
      dispatch(unlikePost(post.id));
    } else {
      dispatch(likePost(post.id));
    }
  };

  const previewText = post.content.length > 500 && !expanded
    ? post.content.slice(0, 500) + '...'
    : post.content;

  return (
    <div className="post-card">
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <span className="post-type">{post.type}</span>
      </div>
      <div className="post-meta">
        <span className="post-author">Автор: <a href="#">{typeof post.author === 'object' ? post.author.nickname : post.author}</a></span>
        <span className="post-direction">Направление: {post.direction}</span>
      </div>
      {post.previewImage && (
        <img className="post-preview-image" src={post.previewImage} alt="Превью" />
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
      </div>
    </div>
  );
};

export default PostCard; 