import React, { useState } from "react";
import type { UserProfile } from "../redux/profileSlice";
import axios from "axios";

interface ProfileEditFormProps {
  initialValues: Partial<UserProfile>;
  onSave: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "QA Engineer",
  "Designer",
  "Manager",
  "HR"
];

const styles: React.CSSProperties = {
  maxWidth: 400,
  margin: "0 auto",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  padding: 32,
  display: "flex",
  flexDirection: "column",
  gap: 18,
  fontFamily: 'Inter, Arial, sans-serif',
  maxHeight: '80vh',
  overflowY: 'auto',
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontWeight: 500,
  color: "#222",
  gap: 6,
  fontSize: 15,
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 15,
  marginTop: 2,
  outline: "none",
  transition: "border 0.2s",
  background: "#f9fafb",
  color: "#111",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 60,
  resize: "vertical",
  color: "#111",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 10,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  background: "#2563eb",
  color: "#fff",
  transition: "background 0.2s",
};

const cancelButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#e5e7eb",
  color: "#222",
};

const errorStyle: React.CSSProperties = {
  color: "#dc2626",
  background: "#fee2e2",
  borderRadius: 8,
  padding: "8px 12px",
  margin: "8px 0",
  fontSize: 14,
};

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ initialValues, onSave, onCancel, loading, error }) => {
  const [form, setForm] = useState({
    firstName: initialValues.firstName || "",
    lastName: initialValues.lastName || "",
    nickname: initialValues.nickname || "",
    role: initialValues.role || roles[0],
    description: initialValues.description || "",
    workplace: initialValues.workplace || "",
    avatar: initialValues.avatar || ""
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setFormError("Имя и фамилия обязательны");
      return;
    }
    if (!form.nickname.trim()) {
      setFormError("Никнейм обязателен");
      return;
    }
    setFormError(null);
    onSave(form);
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    setUploading(true);
    setUploadError(null);
    try {
      // userId должен быть в initialValues._id
      const userId = initialValues._id;
      const res = await axios.post(`http://localhost:5000/api/users/${userId}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setForm(f => ({ ...f, avatar: res.data.avatar }));
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form style={styles} onSubmit={handleSubmit}>
      <h3 style={{ textAlign: "center", marginBottom: 8, color: "#2563eb", fontWeight: 700, fontSize: 22 }}>Редактировать профиль</h3>
      <label style={labelStyle}>
        Аватар
        <input type="file" accept="image/*" onChange={handleAvatarFile} style={{ marginTop: 8 }} disabled={uploading} />
        {uploading && <div style={{ color: '#2563eb', fontSize: 13 }}>Загрузка...</div>}
        {uploadError && <div style={{ color: '#dc2626', fontSize: 13 }}>{uploadError}</div>}
        {form.avatar && (
          <img src={form.avatar.startsWith('/uploads/') ? `http://localhost:5000${form.avatar}` : form.avatar} alt="avatar preview" style={{ width: 80, height: 80, borderRadius: '50%', marginTop: 8, objectFit: 'cover', background: '#f3f4f6' }} />
        )}
      </label>
      <label style={labelStyle}>
        Имя*
        <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Фамилия*
        <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Никнейм*
        <input name="nickname" value={form.nickname} onChange={handleChange} required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Роль/специальность*
        <select name="role" value={form.role} onChange={handleChange} required style={inputStyle}>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </label>
      <label style={labelStyle}>
        Место работы
        <input name="workplace" value={form.workplace} onChange={handleChange} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Описание
        <textarea name="description" value={form.description} onChange={handleChange} style={textareaStyle} />
      </label>
      {(formError || error) && <div style={errorStyle}>{formError || error}</div>}
      <div style={actionsStyle}>
        <button type="submit" disabled={loading} style={buttonStyle}>Сохранить</button>
        <button type="button" onClick={onCancel} style={cancelButtonStyle}>Отмена</button>
      </div>
    </form>
  );
};

export default ProfileEditForm; 