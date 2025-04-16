import React from 'react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="error-display">
      <h2>Error</h2>
      <p>{error?.message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="retry-button"
        >
          Try Again
        </button>
      )}
      <button 
        onClick={() => window.location.reload()}
        className="reload-button"
      >
        Reload Page
      </button>
    </div>
  );
};

export default ErrorDisplay; 