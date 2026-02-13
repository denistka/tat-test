import React, { useRef, useEffect } from 'react';
import type { GeoEntity } from '../../types/geo.js';
import { DropdownItem } from './DropdownItem.js';
import './DropdownMenu.css';

interface DropdownMenuProps {
  items: GeoEntity[];
  isOpen: boolean;
  onSelect: (entity: GeoEntity) => void;
  onClose: () => void;
  isLoading: boolean;
}

/**
 * Dropdown container component that renders the list of results.
 * UI layer: handles positioning (CSS), loading state, and click-outside closing.
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  items, 
  isOpen, 
  onSelect, 
  onClose,
  isLoading 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Click-outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click was outside the menu (and not on the trigger parent if possible)
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="dropdown-menu" 
      ref={menuRef}
      role="listbox"
      aria-expanded={isOpen}
    >
      {isLoading ? (
        <div className="dropdown-menu__status">
          <span className="spinner"></span>
        </div>
      ) : items.length === 0 ? (
        <div className="dropdown-menu__status">
          Нічого не знайдено
        </div>
      ) : (
        items.map((item) => (
          <DropdownItem 
            key={`${item.type}-${item.id}`}
            entity={item}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
};
