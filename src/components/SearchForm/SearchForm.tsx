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
    closeDropdown,
    activeIndex,
    setActiveIndex
  } = useGeoSearch();

  // Notify parent of selection changes (ST4 requirement: cancel if country chosed)
  React.useEffect(() => {
    onSelectionChange?.(selected);
  }, [selected, onSelectionChange]);

  /**
   * BUG FIX: Unified select and submit handler.
   * Ensures search starts immediately on selection (Click or Enter).
   */
  const handleSelectAndSearch = (entity: GeoEntity) => {
    onSelect(entity);
    onSubmit(entity);
    closeDropdown();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selected) {
      handleSelectAndSearch(selected);
      return;
    }

    if (results.length > 0) {
      const indexToSelect = activeIndex >= 0 ? activeIndex : 0;
      handleSelectAndSearch(results[indexToSelect]);
    }
  };

  /**
   * BUG FIX: Handle Keyboard Navigation (Arrows + Enter).
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        onInputClick();
      } else {
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (isOpen && activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        handleSelectAndSearch(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  };

  // Logic: disable if (nothing selected AND query is empty) OR (searching AND same country)
  const currentSelectedCountryID = selected?.type === 'country' ? String(selected.id) : selected?.countryId;
  const isSameCountry = currentSelectedCountryID === activeCountryID;
  
  // Requirement: enable button if input is not empty
  const isSubmitDisabled = (!selected && !query.trim()) || (isSearching && isSameCountry) || isLoading;

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
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        
        <DropdownMenu
          items={results}
          isOpen={isOpen}
          isLoading={isLoading}
          activeIndex={activeIndex}
          onSelect={handleSelectAndSearch}
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
