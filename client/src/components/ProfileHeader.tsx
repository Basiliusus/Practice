import React from "react";
import type { UserProfile } from "../redux/profileSlice";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwner: boolean;
  onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isOwner, onEdit }) => {
  return (
    <div className="profile-header">
      <div className="profile-header__info">
        <h2>{profile.firstName} {profile.lastName}</h2>
        <div className="profile-header__nickname">@{profile.nickname}</div>
        <div className="profile-header__role">{profile.role}</div>
        {profile.workplace && (
          <div className="profile-header__workplace">{profile.workplace}</div>
        )}
        {profile.description && (
          <div className="profile-header__description">{profile.description}</div>
        )}
      </div>
      {isOwner && (
        <button className="profile-header__edit-btn" onClick={onEdit}>
          Редактировать профиль
        </button>
      )}
    </div>
  );
};

export default ProfileHeader; 