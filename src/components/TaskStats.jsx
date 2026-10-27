import React from 'react';

export default function TaskStats({ total, pending, completed }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-dashboard">
      <div className="stat-card stat-total">
        <div className="stat-icon-wrapper total-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      <div className="stat-card stat-pending">
        <div className="stat-icon-wrapper pending-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Pending Tasks</span>
          <span className="stat-value">{pending}</span>
        </div>
      </div>

      <div className="stat-card stat-completed">
        <div className="stat-icon-wrapper completed-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Completed Tasks</span>
          <span className="stat-value">{completed}</span>
        </div>
      </div>

      <div className="stat-card stat-progress">
        <div className="stat-progress-header">
          <span className="stat-label">Completion Rate</span>
          <span className="stat-percentage">{percentage}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <span className="progress-subtext">
          {completed} of {total} tasks completed
        </span>
      </div>
    </div>
  );
}
