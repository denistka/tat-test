import React from 'react'
import type { TourCardData } from '../../types/hotel'
import { TourCard } from '../TourCard/TourCard'
import './ResultsGrid.css'

interface ResultsGridProps {
  tours: TourCardData[];
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ tours }) => {
  if (tours.length === 0) {
    return null
  }

  return (
    <div className="results-grid">
      {tours.map((tour) => (
        <TourCard key={tour.priceId} tour={tour} />
      ))}
    </div>
  );
}
