import { useState } from 'react'
import './index.css'
import { SearchForm } from './components/SearchForm/SearchForm'
import { LoadingState } from './components/SearchResults/LoadingState'
import { ErrorState } from './components/SearchResults/ErrorState'
import { EmptyState } from './components/SearchResults/EmptyState'
import { useSearchPrices } from './hooks/useSearchPrices'
import type { GeoEntity } from './types/geo'

function App() {
  const { status, prices, error, search } = useSearchPrices()
  const [lastSelectedName, setLastSelectedName] = useState<string | null>(null)

  const handleSearchSubmit = (entity: GeoEntity) => {
    setLastSelectedName(entity.name)
    
    // Extract countryId for the price search
    const countryId = entity.type === 'country' ? String(entity.id) : entity.countryId
    
    if (countryId) {
      search(countryId)
    }
  }

  return (
    <main>
      <h1>Tour Search</h1>
      
      <SearchForm onSubmit={handleSearchSubmit} />

      <section className="results-container">
        {(status === 'loading' || status === 'polling') && (
          <LoadingState />
        )}

        {status === 'error' && error && (
          <ErrorState message={error} />
        )}

        {status === 'empty' && (
          <EmptyState />
        )}

        {status === 'success' && prices && (
          <div className="placeholder-results">
            <h2>Тури для {lastSelectedName}</h2>
            <p>Знайдено пропозицій: {Object.keys(prices).length}</p>
            <pre style={{ fontSize: '10px', overflow: 'auto', background: '#eee', padding: '10px' }}>
              {JSON.stringify(prices, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
