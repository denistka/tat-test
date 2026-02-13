import React from 'react';
import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
}

/**
 * Presentational loading component.
 * UI layer: renders a spinner and a descriptive message.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Шукаємо тури..." 
}) => {
  return (
    <div className="loading-state">
      <div className="loading-state__spinner" />
      <p className="loading-state__text">{message}</p>
    </div>
  );
};
