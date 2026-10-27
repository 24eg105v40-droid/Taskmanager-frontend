import React from 'react';

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === 'COMPLETED';

  // Check if task is overdue (dueDate is before today and status is PENDING)
  const isOverdue = React.useMemo(() => {
    if (!task.dueDate || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate + 'T00:00:00');
    return due < today;
  }, [task.dueDate, isCompleted]);

  // Format due date for friendly display
  const formattedDueDate = React.useMemo(() => {
    if (!task.dueDate) return null;
    try {
      const parts = task.dueDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      return task.dueDate;
    } catch (e) {
      return task.dueDate;
    }
  }, [task.dueDate]);

  return (
    <div className={`task-item ${isCompleted ? 'task-completed' : 'task-pending'} ${isOverdue ? 'task-overdue' : ''}`}>
      {/* Status Toggle Checkbox */}
      <button
        type="button"
        className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggleStatus(task.id)}
        title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        aria-label={isCompleted ? 'Mark task as pending' : 'Mark task as completed'}
      >
        {isCompleted && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Task Content */}
      <div className="task-content">
        <div className="task-header-row">
          <h3 className={`task-title ${isCompleted ? 'strikethrough' : ''}`}>
            {task.title}
          </h3>

          <div className="task-badges">
            <span
              className={`status-badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}
              onClick={() => onToggleStatus(task.id)}
              title="Click to toggle status"
              role="button"
              tabIndex={0}
            >
              <span className="status-dot" />
              {task.status}
            </span>

            {isOverdue && (
              <span className="overdue-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="badge-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Overdue
              </span>
            )}
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta-row">
          {formattedDueDate && (
            <div className={`task-due-date ${isOverdue ? 'due-overdue' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Due: {formattedDueDate}</span>
            </div>
          )}

          {task.createdAt && (
            <span className="task-created-at">
              Added {new Date(task.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Task Action Buttons */}
      <div className="task-actions">
        <button
          type="button"
          className="btn-action btn-edit"
          onClick={() => onEdit(task)}
          title="Edit Task"
          aria-label={`Edit ${task.title}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button
          type="button"
          className="btn-action btn-delete"
          onClick={() => onDelete(task)}
          title="Delete Task"
          aria-label={`Delete ${task.title}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}
