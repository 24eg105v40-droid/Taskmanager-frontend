import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import TaskStats from './components/TaskStats';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Notification from './components/Notification';
import { taskService } from './services/taskService';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [notification, setNotification] = useState(null);
  const [backendError, setBackendError] = useState(null);

  // Show notification toast helper
  const notify = useCallback((type, message) => {
    setNotification({ type, message });
  }, []);

  // Fetch all tasks from backend
  const loadTasks = useCallback(async (filter = currentFilter, silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await taskService.getAllTasks(filter === 'ALL' ? null : filter);
      setTasks(data || []);
      setBackendError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setBackendError(err.message);
      if (!silent) {
        notify('error', err.message);
      }
    } finally {
      if (!silent) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentFilter, notify]);

  // Initial load
  useEffect(() => {
    loadTasks(currentFilter);
  }, [currentFilter, loadTasks]);

  // Manual refresh button
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadTasks(currentFilter, false);
  };

  // Compute live stats from loaded tasks (or combined with API stats)
  const counts = useMemo(() => {
    // If current filter is ALL, calculate exact counts
    const total = tasks.length;
    let pending = 0;
    let completed = 0;

    tasks.forEach(task => {
      if (task.status === 'COMPLETED') completed++;
      else pending++;
    });

    return { total, pending, completed };
  }, [tasks]);

  // Filter tasks further by client-side search query
  const displayedTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase().trim();
    return tasks.filter(task =>
      (task.title && task.title.toLowerCase().includes(query)) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  }, [tasks, searchQuery]);

  // 1. Create Task Handler
  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      const response = await taskService.createTask(taskData);
      notify('success', response.message || 'Task added successfully!');
      // Reload tasks to include the new one
      await loadTasks(currentFilter, true);
    } catch (err) {
      notify('error', err.message || 'Failed to create task');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Toggle Task Status Handler
  const handleToggleStatus = async (id) => {
    try {
      const response = await taskService.toggleTaskStatus(id);
      const updated = response.data;
      notify('success', `Task marked as ${updated.status}`);

      // Optimistically update local state or re-fetch
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));

      // If current filter excludes new status, reload
      if (currentFilter !== 'ALL') {
        loadTasks(currentFilter, true);
      }
    } catch (err) {
      notify('error', err.message || 'Failed to update task status');
    }
  };

  // 3. Edit Task (Open Modal)
  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  // Update Task Submission
  const handleUpdateTask = async (id, taskData) => {
    setIsUpdating(true);
    try {
      const response = await taskService.updateTask(id, taskData);
      notify('success', response.message || 'Task updated successfully!');
      setEditingTask(null);
      await loadTasks(currentFilter, true);
    } catch (err) {
      notify('error', err.message || 'Failed to update task');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. Delete Task (Open Confirmation)
  const handleDeleteClick = (task) => {
    setDeletingTask(task);
  };

  // Confirm Delete
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await taskService.deleteTask(id);
      notify('success', response.message || 'Task deleted successfully!');
      setDeletingTask(null);
      // Remove from state immediately
      setTasks(prev => prev.filter(t => t.id !== id));
      await loadTasks(currentFilter, true);
    } catch (err) {
      notify('error', err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          {/* Notification Toast */}
          <Notification
            notification={notification}
            onDismiss={() => setNotification(null)}
          />

          {/* Backend Connection Error Alert */}
          {backendError && (
            <div className="alert-banner alert-warning" role="alert">
              <div className="alert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="alert-body">
                <h4 className="alert-heading">Database / Backend Connection Notice</h4>
                <p>{backendError}</p>
                <p className="alert-sub">Make sure MySQL service is running and Spring Boot backend is started on <code>https://taskmanager-backend-ec7b.onrender.com</code>.</p>
              </div>
              <button
                type="button"
                className="btn-retry"
                onClick={handleRefresh}
              >
                Retry
              </button>
            </div>
          )}

          {/* Dashboard Summary Stats */}
          <TaskStats
            total={counts.total}
            pending={counts.pending}
            completed={counts.completed}
          />

          {/* Two-Column Workspace Layout */}
          <div className="workspace-grid">
            {/* Left Column: Task Creation Form */}
            <section className="form-column" aria-label="Task Creation Form">
              <TaskForm
                onTaskCreated={handleCreateTask}
                isSubmitting={isSubmitting}
              />
            </section>

            {/* Right Column: Task Management & Filter */}
            <section className="tasks-column" aria-label="Task Management List">
              <div className="card task-list-card">
                <div className="card-header task-list-header">
                  <div className="task-list-title-wrap">
                    <h2 className="card-title">Tasks Overview</h2>
                    <span className="task-count-pill">{displayedTasks.length} listed</span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <TaskFilter
                  currentFilter={currentFilter}
                  onFilterChange={setCurrentFilter}
                  counts={counts}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                {/* Task Items List */}
                <TaskList
                  tasks={displayedTasks}
                  isLoading={isLoading}
                  currentFilter={currentFilter}
                  searchQuery={searchQuery}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Edit Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onUpdate={handleUpdateTask}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        task={deletingTask}
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>Daily Task Manager &copy; {new Date().getFullYear()} &bull; Built with Spring Boot, MySQL &amp; React.js</p>
      </footer>
    </div>
  );
}
