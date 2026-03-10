import React from 'react'
import './LoadingState.css'

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Шукаємо тури...',
}) => {
  return (
    <div className="loading-state">
      <div className="loading-state__spinner" />
      <p className="loading-state__text">{message}</p>
    </div>
  );
}
