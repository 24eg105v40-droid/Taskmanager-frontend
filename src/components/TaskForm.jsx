import React, { useState } from 'react';

export default function TaskForm({ onTaskCreated, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'PENDING'
  });

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!formData.title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      await onTaskCreated({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        dueDate: formData.dueDate || null,
        status: formData.status
      });

      // Reset form upon successful creation
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        status: 'PENDING'
      });
      setTouched(false);
      setError('');
    } catch (err) {
      // Error handled by parent toast/notification
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      status: 'PENDING'
    });
    setTouched(false);
    setError('');
  };

  return (
    <div className="card task-form-card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <h2 className="card-title">Add New Task</h2>
      </div>

      <form onSubmit={handleSubmit} className="task-form" noValidate>
        {/* Task Title */}
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Task Title <span className="required-asterisk">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            name="title"
            placeholder="e.g., Prepare quarterly presentation"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${error && touched ? 'input-error' : ''}`}
            disabled={isSubmitting}
            maxLength={255}
            required
          />
          {error && touched && (
            <span className="error-text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </span>
          )}
        </div>

        {/* Task Description */}
        <div className="form-group">
          <label htmlFor="task-description" className="form-label">
            Description <span className="optional-label">(Optional)</span>
          </label>
          <textarea
            id="task-description"
            name="description"
            placeholder="Add details, notes, or instructions for this task..."
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* Row for Due Date and Status */}
        <div className="form-row">
          <div className="form-group col-half">
            <label htmlFor="task-due-date" className="form-label">
              Due Date <span className="optional-label">(Optional)</span>
            </label>
            <input
              id="task-due-date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group col-half">
            <label htmlFor="task-status" className="form-label">
              Initial Status
            </label>
            <select
              id="task-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting || (!formData.title && !formData.description && !formData.dueDate)}
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>Saving Task...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
