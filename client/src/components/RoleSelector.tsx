import React from 'react';

const roles = [
  'Frontend Developer',
  'Backend Developer',
  'QA Engineer',
  'Designer',
  'Manager',
  'HR'
];

type Props = {
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const RoleSelector: React.FC<Props> = ({ value, name, onChange }) => (
  <div className="role-selector">
    <label>Роль</label>
    <select value={value} name={name} onChange={onChange} required>
      <option value="">Выберите роль</option>
      {roles.map(role => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  </div>
);

export default RoleSelector; 