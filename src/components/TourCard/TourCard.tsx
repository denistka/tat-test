import React from 'react';
import type { TourCardData } from '../../types/hotel';
import { formatPrice, formatDateRange } from '../../utils/priceFormatter';
import './TourCard.css';

interface TourCardProps {
  tour: TourCardData;
}

/**
 * Presentational component for displaying a single tour card.
 * Renders hotel image, name, location, dates, and price.
 */
export const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const { amount, currency, startDate, endDate, hotel } = tour;

  return (
    <article className="tour-card">
      <img 
        src={hotel.img} 
        alt={hotel.name} 
        className="tour-card__image" 
        loading="lazy"
      />
      <div className="tour-card__content">
        <h3 className="tour-card__hotel-name">{hotel.name}</h3>
        <p className="tour-card__location">
          {hotel.cityName}, {hotel.countryName}
        </p>
        
        <div className="tour-card__footer">
          <div className="tour-card__dates">
            {formatDateRange(startDate, endDate)}
          </div>
          <div className="tour-card__price">
            {formatPrice(amount, currency)}
          </div>
        </div>
      </div>
    </article>
  );
};
