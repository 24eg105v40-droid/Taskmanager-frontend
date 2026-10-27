import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  isLoading,
  currentFilter,
  searchQuery,
  onToggleStatus,
  onEdit,
  onDelete
}) {
  if (isLoading) {
    return (
      <div className="task-list-loading">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    );
  }

  if (tasks.length === 0) {
    let emptyTitle = 'No tasks found';
    let emptyDesc = 'You have not added any tasks yet. Use the form above to add your first task!';

    if (searchQuery) {
      emptyTitle = 'No matching tasks';
      emptyDesc = `No tasks matched your search query "${searchQuery}". Try a different keyword.`;
    } else if (currentFilter === 'PENDING') {
      emptyTitle = 'No pending tasks!';
      emptyDesc = 'Great job! You have completed all your pending tasks or haven\'t added any yet.';
    } else if (currentFilter === 'COMPLETED') {
      emptyTitle = 'No completed tasks yet';
      emptyDesc = 'Tasks you mark as completed will appear here.';
    }

    return (
      <div className="empty-state">
        <div className="empty-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="2" />
            <path d="M9 14l2 2 4-4" />
          </svg>
        </div>
        <h3 className="empty-title">{emptyTitle}</h3>
        <p className="empty-desc">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
