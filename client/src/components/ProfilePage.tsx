import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchUserProfile, updateUserProfile, addProject, updateProject, deleteProject } from "../redux/profileSlice";
import type { UserProfile, Project } from "../redux/profileSlice";
import ProfileHeader from "./ProfileHeader";
import PortfolioBlock from "./PortfolioBlock";
import ProfileEditForm from "./ProfileEditForm";
import ProjectForm from "./ProjectForm";
import ProjectCard from "./ProjectCard";
import ConfirmationModal from "./ConfirmationModal";

interface ProfilePageProps {
  userId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const currentUser = useSelector((state: RootState) => state.user.user);
  // currentUser приходит с id, profile с _id
  const isOwner = currentUser && profile && currentUser._id === profile._id;
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Модальные окна (заглушки)
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);

  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  const [confirmDeleteProject, setConfirmDeleteProject] = useState<Project | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId) as any);
    }
  }, [dispatch, userId]);

  if (!userId) return <div>Загрузка...</div>;
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!profile) return <div>Профиль не найден</div>;

  // Стили
  const pageStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    maxWidth: 1000,
    margin: '0 auto',
    padding: '32px 16px',
  };
  const layoutStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  };
  const desktopLayoutStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: 32,
    alignItems: 'flex-start',
  };
  const profileCardStyles: React.CSSProperties = {
    minWidth: 320,
    maxWidth: 350,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Inter, Arial, sans-serif',
  };
  const avatarStyles: React.CSSProperties = {
    width: 90,
    height: 90,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#dbeafe,#f1f5f9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 38,
    color: '#2563eb',
    fontWeight: 700,
    marginBottom: 18,
    userSelect: 'none',
  };
  const infoListStyles: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 18,
  };
  const infoItemStyles: React.CSSProperties = {
    fontSize: 16,
    color: '#222',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };
  const nicknameStyles: React.CSSProperties = {
    color: '#64748b',
    fontWeight: 400,
    fontSize: 15,
  };
  const descStyles: React.CSSProperties = {
    color: '#334155',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 0,
    fontWeight: 400,
  };
  const portfolioBlockStyles: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };
  const portfolioGridStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  };
  const projectCardWrapperStyles: React.CSSProperties = {
    background: '#fff',
    border: '1.5px solid #e5e7eb',
    borderRadius: 14,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    padding: 18,
    margin: 0,
    width: '100%',
    boxSizing: 'border-box',
    transition: 'box-shadow 0.2s',
  };

  return (
    <div style={pageStyles}>
      <div
        style={window.innerWidth > 800 ? desktopLayoutStyles : layoutStyles}
        className="profile-layout"
      >
        <div style={profileCardStyles}>
          {profile.avatar ? (
            <img
              src={profile.avatar.startsWith('/uploads/') ? `http://localhost:5000${profile.avatar}` : profile.avatar}
              alt="avatar"
              style={{ ...avatarStyles, objectFit: 'cover', background: '#f3f4f6' }}
            />
          ) : (
            <div style={avatarStyles}>
              {profile.firstName?.[0] || ''}{profile.lastName?.[0] || ''}
            </div>
          )}
          <div style={infoListStyles}>
            <div style={infoItemStyles}><span>{profile.firstName} {profile.lastName}</span></div>
            <div style={{ ...infoItemStyles, ...nicknameStyles }}>@{profile.nickname}</div>
            <div style={infoItemStyles}>{profile.role}</div>
            {profile.workplace && (
              <div style={infoItemStyles}>🏢 {profile.workplace}</div>
            )}
          </div>
          {profile.description && (
            <div style={descStyles}>{profile.description}</div>
          )}
          {isOwner && (
            <button
              style={{ marginTop: 18, padding: '10px 20px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
              onClick={() => setEditProfileOpen(true)}
            >
              Редактировать профиль
            </button>
          )}
        </div>
        <div style={portfolioBlockStyles}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#222', margin: 0 }}>Портфолио</h3>
            {isOwner && (
              <button
                style={{ padding: '8px 16px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                onClick={() => setEditProject({} as Project)}
              >
                Добавить проект
              </button>
            )}
          </div>
          <div style={portfolioGridStyles}>
            {profile.portfolio.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: 16, gridColumn: '1/-1' }}>Нет проектов</div>
            ) : (
              profile.portfolio.map((project) => (
                <div key={project._id} style={projectCardWrapperStyles}>
                  <ProjectCard
                    project={project}
                    isOwner={!!isOwner}
                    onEdit={() => setEditProject(project)}
                    onDelete={() => setConfirmDeleteProject(project)}
                    onView={() => setViewProject(project)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Модалка редактирования профиля */}
      {editProfileOpen && profile && (
        <div className="modal-overlay">
          <div className="modal">
            <ProfileEditForm
              initialValues={profile}
              loading={saving}
              error={saveError}
              onSave={async (data) => {
                setSaving(true);
                setSaveError(null);
                try {
                  await dispatch(updateUserProfile({ id: profile._id, data }) as any).unwrap();
                  setEditProfileOpen(false);
                } catch (e: any) {
                  setSaveError(e?.message || "Ошибка при сохранении");
                } finally {
                  setSaving(false);
                }
              }}
              onCancel={() => setEditProfileOpen(false)}
            />
          </div>
        </div>
      )}
      {/* Модалка добавления/редактирования проекта */}
      {editProject && (
        <div className="modal-overlay">
          <div className="modal">
            <ProjectForm
              initialValues={editProject && '_id' in editProject && editProject._id ? editProject : {}}
              loading={projectSaving}
              error={projectError}
              onSave={async (data) => {
                setProjectSaving(true);
                setProjectError(null);
                try {
                  if (editProject && '_id' in editProject && editProject._id) {
                    await dispatch(updateProject({ id: profile._id, projectId: editProject._id, data }) as any).unwrap();
                  } else {
                    await dispatch(addProject({ id: profile._id, data }) as any).unwrap();
                  }
                  setEditProject(null);
                } catch (e: any) {
                  setProjectError(e?.message || "Ошибка при сохранении проекта");
                } finally {
                  setProjectSaving(false);
                }
              }}
              onCancel={() => setEditProject(null)}
            />
          </div>
        </div>
      )}
      {/* Модалка просмотра проекта */}
      {viewProject && (
        <div className="modal-overlay">
          <div className="modal">
            <ProjectCard
              project={viewProject}
              isOwner={!!isOwner}
              onEdit={() => {
                setEditProject(viewProject);
                setViewProject(null);
              }}
              onDelete={() => {}}
              onView={() => {}}
            />
            <button style={{ marginTop: 18 }} onClick={() => setViewProject(null)}>Закрыть</button>
          </div>
        </div>
      )}
      {/* Модалка подтверждения удаления проекта */}
      {confirmDeleteProject && (
        <ConfirmationModal
          title="Удалить проект?"
          message={`Вы действительно хотите удалить проект "${confirmDeleteProject.title}"? Это действие нельзя отменить.`}
          onConfirm={async () => {
            try {
              await dispatch(deleteProject({ id: profile._id, projectId: confirmDeleteProject._id, title: confirmDeleteProject._id ? undefined : confirmDeleteProject.title }) as any).unwrap();
              await dispatch(fetchUserProfile(profile._id) as any);
            } catch (e: any) {
              alert('Ошибка при удалении проекта: ' + (e?.message || JSON.stringify(e)));
            } finally {
              setConfirmDeleteProject(null);
            }
          }}
          onCancel={() => setConfirmDeleteProject(null)}
          confirmText="Удалить"
          cancelText="Отмена"
        />
      )}
    </div>
  );
};

export default ProfilePage; 