import React, { useState, useEffect } from 'react';

export default function TaskModal({ task, isOpen, onClose, onUpdate, isUpdating }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'PENDING'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        status: task.status || 'PENDING'
      });
      setError('');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      await onUpdate(task.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        dueDate: formData.dueDate || null,
        status: formData.status
      });
      onClose();
    } catch (err) {
      // Handled by parent notification
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-dialog">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">Edit Task</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="edit-title" className="form-label">
                Task Title <span className="required-asterisk">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${error ? 'input-error' : ''}`}
                maxLength={255}
                disabled={isUpdating}
                required
              />
              {error && <span className="error-text">{error}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="edit-description" className="form-label">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
                disabled={isUpdating}
              />
            </div>

            {/* Due Date & Status */}
            <div className="form-row">
              <div className="form-group col-half">
                <label htmlFor="edit-due-date" className="form-label">
                  Due Date
                </label>
                <input
                  id="edit-due-date"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isUpdating}
                />
              </div>

              <div className="form-group col-half">
                <label htmlFor="edit-status" className="form-label">
                  Status
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  disabled={isUpdating}
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
