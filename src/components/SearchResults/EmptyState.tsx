import React from 'react';
import './EmptyState.css';

/**
 * Presentational empty state component.
 * UI layer: renders informative message when no results match the query.
 */
export const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">🔍</div>
      <p className="empty-state__message">
        За вашим запитом турів не знайдено
      </p>
    </div>
  );
};
