import { useState, useMemo } from 'react'
import './index.css'
import { SearchForm } from './components/SearchForm/SearchForm'
import { LoadingState } from './components/SearchResults/LoadingState'
import { ErrorState } from './components/SearchResults/ErrorState'
import { EmptyState } from './components/SearchResults/EmptyState'
import { ResultsGrid } from './components/SearchResults/ResultsGrid'
import { useSearchPrices } from './hooks/useSearchPrices'
import { useHotels } from './hooks/useHotels'
import { joinTourData } from './utils/tourDataJoin'
import type { GeoEntity } from './types/geo'

function App() {
  const { status, prices, error: searchError, isSearching, activeCountryID, search } = useSearchPrices()
  const { hotels, isLoading: isHotelsLoading, error: hotelsError, fetchHotels } = useHotels()
  const [lastSelectedName, setLastSelectedName] = useState<string | null>(null)

  const handleSearchSubmit = (entity: GeoEntity) => {
    setLastSelectedName(entity.name)
    
    // Extract countryId for the price search
    const countryId = entity.type === 'country' ? String(entity.id) : entity.countryId
    
    if (countryId) {
      search(countryId)
      fetchHotels(countryId)
    }
  }

  // Memoize sorted tours to avoid re-calculating on every render
  const sortedTours = useMemo(() => {
    if (status === 'success' && prices && hotels) {
      return joinTourData(prices, hotels);
    }
    return [];
  }, [status, prices, hotels]);

  const error = searchError || hotelsError;
  const isLoading = status === 'loading' || status === 'polling' || isHotelsLoading;

  return (
    <main>
      <h1>Tour Search</h1>
      
      <SearchForm 
        onSubmit={handleSearchSubmit} 
        isSearching={isSearching}
        activeCountryID={activeCountryID}
      />

      <section className="results-container">
        {isLoading && (
          <LoadingState />
        )}

        {!isLoading && error && (
          <ErrorState message={error} />
        )}

        {!isLoading && status === 'empty' && (
          <EmptyState />
        )}

        {!isLoading && status === 'success' && sortedTours.length > 0 && (
          <div className="search-results">
            <h2>Тури для {lastSelectedName}</h2>
            <ResultsGrid tours={sortedTours} />
          </div>
        )}

        {!isLoading && status === 'success' && sortedTours.length === 0 && (
          <EmptyState />
        )}
      </section>
    </main>
  )
}

export default App
