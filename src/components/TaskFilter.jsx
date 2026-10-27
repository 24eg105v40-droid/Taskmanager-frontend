import React from 'react';

export default function TaskFilter({
  currentFilter,
  onFilterChange,
  counts,
  searchQuery,
  onSearchChange
}) {
  const filters = [
    { id: 'ALL', label: 'All Tasks', count: counts.total },
    { id: 'PENDING', label: 'Pending', count: counts.pending },
    { id: 'COMPLETED', label: 'Completed', count: counts.completed }
  ];

  return (
    <div className="task-filter-container">
      {/* Filter Tabs */}
      <div className="filter-tabs" role="tablist">
        {filters.map(filter => (
          <button
            key={filter.id}
            role="tab"
            aria-selected={currentFilter === filter.id}
            className={`filter-tab ${currentFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <span className="tab-label">{filter.label}</span>
            <span className={`tab-badge badge-${filter.id.toLowerCase()}`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
