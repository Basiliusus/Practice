import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { createPost, updatePost } from '../redux/postsSlice';

const postTypes = ['Контент', 'Событие', 'Вакансия'];
const directions = [
  'Frontend Developer',
  'Backend Developer',
  'QA Engineer',
  'Designer',
  'Manager',
  'HR'
];

interface PostFormProps {
  initialData?: {
    _id?: string;
    title: string;
    content: string;
    type: string;
    direction: string;
    previewImage?: string;
  };
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [type, setType] = useState(initialData?.type || postTypes[0]);
  const [direction, setDirection] = useState(initialData?.direction || directions[0]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(initialData?.previewImage);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialData?.title || '');
    setContent(initialData?.content || '');
    setType(initialData?.type || postTypes[0]);
    setDirection(initialData?.direction || directions[0]);
    setPreviewImage(initialData?.previewImage);
  }, [initialData]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    if (!title.trim() || !content.trim()) {
      setError('Заполните все обязательные поля.');
      return false;
    }
    if (title.length < 3) {
      setError('Заголовок слишком короткий.');
      return false;
    }
    if (content.length < 10) {
      setError('Содержимое слишком короткое.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (initialData?._id) {
        await dispatch(updatePost({
          id: initialData._id,
          data: { title, content, type, direction, previewImage }
        })).unwrap();
      } else {
        await dispatch(createPost({ title, content, type, direction, previewImage })).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении поста.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h2>{initialData ? 'Редактировать пост' : 'Создать пост'}</h2>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        placeholder="Заголовок"
        value={title}
        onChange={e => setTitle(e.target.value)}
        minLength={3}
        required
      />
      <textarea
        placeholder="Содержимое"
        value={content}
        onChange={e => setContent(e.target.value)}
        minLength={10}
        required
      />
      <select value={type} onChange={e => setType(e.target.value)}>
        {postTypes.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select value={direction} onChange={e => setDirection(e.target.value)}>
        {directions.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <div className="image-upload">
        <label>Превью-картинка:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImage && (
          <div className="preview-image">
            <img src={previewImage} alt="preview" style={{ maxWidth: 200, maxHeight: 120 }} />
            <button type="button" onClick={() => setPreviewImage(undefined)}>Удалить</button>
          </div>
        )}
      </div>
      <div className="form-actions">
        <button type="submit" disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </div>
    </form>
  );
};

export default PostForm; 