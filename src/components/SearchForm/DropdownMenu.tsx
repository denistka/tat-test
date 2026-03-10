import React, { useRef, useEffect } from 'react'
import type { GeoEntity } from '../../types/geo.js'
import { DropdownItem } from './DropdownItem.js'
import './DropdownMenu.css'

interface DropdownMenuProps {
  items: GeoEntity[];
  isOpen: boolean;
  onSelect: (entity: GeoEntity) => void;
  onClose: () => void;
  isLoading: boolean;
  activeIndex?: number;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  onSelect,
  onClose,
  isLoading,
  activeIndex = -1,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

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
        items.map((item, index) => (
          <DropdownItem
            key={`${item.type}-${item.id}`}
            entity={item}
            isActive={index === activeIndex}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
}
