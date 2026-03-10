import React from 'react'
import './EmptyState.css'

export const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">🔍</div>
      <p className="empty-state__message">
        За вашим запитом турів не знайдено
      </p>
    </div>
  );
}
