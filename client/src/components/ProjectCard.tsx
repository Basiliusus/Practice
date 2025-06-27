import React, { useState } from "react";
import type { Project } from "../redux/profileSlice";

interface ProjectCardProps {
  project: Project;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const basePreviewImageStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: 180,
  borderRadius: 10,
  marginBottom: 12,
  display: 'block',
  background: '#f3f4f6',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isOwner, onEdit, onDelete, onView }) => {
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('contain');

  const previewImageStyle: React.CSSProperties = {
    ...basePreviewImageStyle,
    objectFit: fitMode,
  };

  return (
    <div className="project-card" onClick={onView} tabIndex={0} role="button">
      {project.previewImage && (
        <div style={{ position: 'relative' }}>
          <img src={project.previewImage} alt={project.title} style={previewImageStyle} />
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
      <div className="project-card__content">
        <h4 className="project-card__title">{project.title}</h4>
        {project.description && (
          <div className="project-card__desc">{project.description}</div>
        )}
        {project.links && project.links.length > 0 && (
          <div className="project-card__links">
            {project.links.map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                {link.replace(/^https?:\/\//, "")}
              </a>
            ))}
          </div>
        )}
        {isOwner && (
          <div className="project-card__actions">
            <button onClick={e => { e.stopPropagation(); onEdit(); }}>Редактировать</button>
            <button onClick={e => { e.stopPropagation(); onDelete(); }}>Удалить</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 