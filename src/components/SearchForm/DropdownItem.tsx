import React from 'react';
import { GeoEntity } from '../../types/geo.js';

interface DropdownItemProps {
  entity: GeoEntity;
  isActive?: boolean;
  onSelect: (entity: GeoEntity) => void;
}

/**
 * Presentational component for a single dropdown row.
 * UI layer: pure presentational, no state.
 */
export const DropdownItem: React.FC<DropdownItemProps> = ({ entity, isActive, onSelect }) => {
  const getIcon = () => {
    switch (entity.type) {
      case 'country':
        return entity.flag ? <img src={entity.flag} alt="" className="dropdown-item__flag" /> : '🏳️';
      case 'city':
        return '🏙️';
      case 'hotel':
        return '🏨';
      default:
        return '📍';
    }
  };

  return (
    <div 
      className={`dropdown-item ${isActive ? 'dropdown-item--active' : ''}`}
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(entity)}
    >
      <span className="dropdown-item__icon">{getIcon()}</span>
      <span className="dropdown-item__name">{entity.name}</span>
      {entity.cityName && (
        <span className="dropdown-item__meta">{entity.cityName}</span>
      )}
    </div>
  );
};
