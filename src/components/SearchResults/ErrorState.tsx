import React from 'react';
import './ErrorState.css';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Presentational error component.
 * UI layer: displays error icon, message, and optional retry action.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-state__icon">⚠️</div>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button className="error-state__retry" onClick={onRetry}>
          Спробувати ще раз
        </button>
      )}
    </div>
  );
};
