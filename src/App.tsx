import { useState } from 'react'
import './index.css'
import { SearchForm } from './components/SearchForm/SearchForm'
import type { GeoEntity } from './types/geo'

function App() {
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null)

  const handleSearchSubmit = (entity: GeoEntity) => {
    console.log('Search submitted for:', entity)
    
    // Store country ID for the next phase (Price Engine)
    // If it's a country, we use its ID. If it's a city/hotel, we use the countryId property.
    const countryId = entity.type === 'country' ? String(entity.id) : entity.countryId
    
    if (countryId) {
      setSelectedCountryId(countryId)
    }
  }

  return (
    <main>
      <h1>Tour Search</h1>
      
      <SearchForm onSubmit={handleSearchSubmit} />

      {selectedCountryId && (
        <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-muted)' }}>
          Selected Country ID for Price Engine: {selectedCountryId}
        </p>
      )}
    </main>
  )
}

export default App
