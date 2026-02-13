import React from 'react';
import { useGeoSearch } from '../../hooks/useGeoSearch.js';
import { DropdownMenu } from './DropdownMenu.js';
import { GeoEntity } from '../../types/geo.js';
import './SearchForm.css';

interface SearchFormProps {
  onSubmit: (entity: GeoEntity) => void;
}

/**
 * Main search form component.
 * Composes the geo-search logic (hook) with UI elements.
 * Following CTO rule: < 100 lines.
 */
export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
  const {
    query,
    results,
    selected,
    isOpen,
    isLoading,
    onInputClick,
    onInputChange,
    onSelect,
    closeDropdown
  } = useGeoSearch();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      onSubmit(selected);
    }
  };

  return (
    <form className="search-form" onSubmit={handleFormSubmit}>
      <div className="search-form__input-wrapper">
        <input
          type="text"
          className="search-form__input"
          placeholder="Куди ви хочете поїхати?"
          value={query}
          onFocus={onInputClick}
          onClick={onInputClick}
          onChange={(e) => onInputChange(e.target.value)}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        
        <DropdownMenu
          items={results}
          isOpen={isOpen}
          isLoading={isLoading}
          onSelect={onSelect}
          onClose={closeDropdown}
        />
      </div>

      <button 
        type="submit" 
        className="search-form__submit"
        disabled={!selected}
      >
        Знайти
      </button>
    </form>
  );
};
