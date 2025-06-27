import React from "react";
import type { Project } from "../redux/profileSlice";
import ProjectCard from "./ProjectCard.tsx";

interface PortfolioBlockProps {
  projects: Project[];
  isOwner: boolean;
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onView: (project: Project) => void;
}

const PortfolioBlock: React.FC<PortfolioBlockProps> = ({ projects, isOwner, onAdd, onEdit, onDelete, onView }) => {
  return (
    <div className="portfolio-block">
      <div className="portfolio-block__header">
        <h3>Портфолио</h3>
        {isOwner && (
          <button className="portfolio-block__add-btn" onClick={onAdd}>
            Добавить проект
          </button>
        )}
      </div>
      <div className="portfolio-block__list">
        {projects.length === 0 ? (
          <div className="portfolio-block__empty">Нет проектов</div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isOwner={isOwner}
              onEdit={() => onEdit(project)}
              onDelete={() => onDelete(project)}
              onView={() => onView(project)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PortfolioBlock; 