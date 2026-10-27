import React, { useEffect } from 'react';

export default function Notification({ notification, onDismiss }) {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div className={`notification-toast ${isSuccess ? 'toast-success' : 'toast-error'}`} role="alert">
      <div className="toast-icon">
        {isSuccess ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>

      <div className="toast-content">
        <span className="toast-title">{isSuccess ? 'Success' : 'Error'}</span>
        <span className="toast-message">{notification.message}</span>
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={onDismiss}
        aria-label="Dismiss alert"
      >
        ×
      </button>
    </div>
  );
}
