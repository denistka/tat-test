import React from 'react';
import { TourCardData } from '../../types/hotel';
import { TourCard } from '../TourCard/TourCard';
import './ResultsGrid.css';

interface ResultsGridProps {
  tours: TourCardData[];
}

/**
 * Container component that renders a responsive grid of tour cards.
 * Uses CSS Grid for layout handling.
 */
export const ResultsGrid: React.FC<ResultsGridProps> = ({ tours }) => {
  if (tours.length === 0) {
    return null;
  }

  return (
    <div className="results-grid">
      {tours.map((tour) => (
        <TourCard key={tour.priceId} tour={tour} />
      ))}
    </div>
  );
};
