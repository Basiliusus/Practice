import React, { useState } from "react";
import type { Project } from "../redux/profileSlice";

interface ProjectFormProps {
  initialValues?: Partial<Project>;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

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

const linkRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 4,
};

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues = {}, onSave, onCancel, loading, error }) => {
  const [form, setForm] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    links: initialValues.links || [""],
    previewImage: initialValues.previewImage || ""
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (idx: number, value: string) => {
    const links = [...form.links];
    links[idx] = value;
    setForm({ ...form, links });
  };

  const addLink = () => {
    if (form.links.length < 3) setForm({ ...form, links: [...form.links, ""] });
  };

  const removeLink = (idx: number) => {
    const links = form.links.filter((_, i) => i !== idx);
    setForm({ ...form, links });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Название обязательно");
      return;
    }
    if (form.title.length > 100) {
      setFormError("Название не должно превышать 100 символов");
      return;
    }
    if (form.links.some(link => link && !/^https?:\/\//.test(link))) {
      setFormError("Ссылки должны начинаться с http:// или https://");
      return;
    }
    setFormError(null);
    onSave({
      ...form,
      links: form.links.filter(l => l.trim() !== "")
    });
  };

  return (
    <form style={styles} onSubmit={handleSubmit}>
      <h3 style={{ textAlign: "center", marginBottom: 8, color: "#2563eb", fontWeight: 700, fontSize: 22 }}>
        {initialValues && initialValues._id ? "Редактировать проект" : "Добавить проект"}
      </h3>
      <label style={labelStyle}>
        Название проекта*
        <input name="title" value={form.title} onChange={handleChange} maxLength={100} required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Описание
        <textarea name="description" value={form.description} onChange={handleChange} style={textareaStyle} />
      </label>
      <label style={labelStyle}>
        Ссылки на проект (до 3)
        {form.links.map((link, idx) => (
          <div key={idx} style={linkRowStyle}>
            <input
              value={link}
              onChange={e => handleLinkChange(idx, e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
            {form.links.length > 1 && (
              <button type="button" onClick={() => removeLink(idx)} style={cancelButtonStyle}>-</button>
            )}
            {idx === form.links.length - 1 && form.links.length < 3 && (
              <button type="button" onClick={addLink} style={buttonStyle}>+</button>
            )}
          </div>
        ))}
      </label>
      <label style={labelStyle}>
        Фото-превью (URL)
        <input name="previewImage" value={form.previewImage} onChange={handleChange} placeholder="https://..." style={inputStyle} />
      </label>
      {(formError || error) && <div style={errorStyle}>{formError || error}</div>}
      <div style={actionsStyle}>
        <button type="submit" disabled={loading} style={buttonStyle}>Сохранить</button>
        <button type="button" onClick={onCancel} style={cancelButtonStyle}>Отмена</button>
      </div>
    </form>
  );
};

export default ProjectForm; 