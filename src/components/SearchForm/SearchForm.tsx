import React from 'react';
import { useGeoSearch } from '../../hooks/useGeoSearch.js';
import { DropdownMenu } from './DropdownMenu.js';
import type { GeoEntity } from '../../types/geo.js';
import './SearchForm.css';

interface SearchFormProps {
  onSubmit: (entity: GeoEntity) => void;
  isSearching?: boolean;
  activeCountryID?: string | null;
  onSelectionChange?: (entity: GeoEntity | null) => void;
}

/**
 * Main search form component.
 * Composes the geo-search logic (hook) with UI elements.
 * Following CTO rule: < 100 lines.
 */
export const SearchForm: React.FC<SearchFormProps> = ({ 
  onSubmit, 
  isSearching = false, 
  activeCountryID = null,
  onSelectionChange
}) => {
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

  // Notify parent of selection changes (ST4 requirement: cancel if country chosed)
  React.useEffect(() => {
    onSelectionChange?.(selected);
  }, [selected, onSelectionChange]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      onSubmit(selected);
    }
  };

  // Logic: disable if nothing selected OR (searching AND same country)
  const currentSelectedCountryID = selected?.type === 'country' ? String(selected.id) : selected?.countryId;
  const isSameCountry = currentSelectedCountryID === activeCountryID;
  const isSubmitDisabled = !selected || (isSearching && isSameCountry);

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
        disabled={isSubmitDisabled}
      >
        {isSearching && isSameCountry ? 'Шукаємо...' : 'Знайти'}
      </button>
    </form>
  );
};
