import React from 'react';

interface FilterBarProps {
  type: string;
  direction: string;
  onTypeChange: (type: string) => void;
  onDirectionChange: (direction: string) => void;
}

const postTypes = ['Все', 'Контент', 'Событие', 'Вакансия'];
const directions = [
  'Все',
  'Frontend Developer',
  'Backend Developer',
  'QA Engineer',
  'Designer',
  'Manager',
  'HR'
];

const FilterBar: React.FC<FilterBarProps> = ({ type, direction, onTypeChange, onDirectionChange }) => {
  return (
    <div className="filter-bar">
      <select value={type} onChange={e => onTypeChange(e.target.value)}>
        {postTypes.map(t => (
          <option key={t} value={t === 'Все' ? '' : t}>{t}</option>
        ))}
      </select>
      <select value={direction} onChange={e => onDirectionChange(e.target.value)}>
        {directions.map(d => (
          <option key={d} value={d === 'Все' ? '' : d}>{d}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar; 