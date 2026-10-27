/**
 * Daily Task Manager - API Service
 * Handles all HTTP communication with Spring Boot backend REST APIs
 */

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/tasks`;

/**
 * Helper to handle HTTP responses and uniform error extraction
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (data) {
      if (data.validationErrors) {
        errorMessage = Object.values(data.validationErrors).join(', ');
      } else if (data.message) {
        errorMessage = data.message;
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const taskService = {
  /**
   * Fetch all tasks, optionally filtered by status ('PENDING' or 'COMPLETED')
   */
  async getAllTasks(status = null) {
    try {
      const url = status && status !== 'ALL'
        ? `${BASE_URL}?status=${encodeURIComponent(status)}`
        : BASE_URL;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return await handleResponse(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to backend server. Please verify Spring Boot is running on port 8080.');
      }
      throw error;
    }
  },

  /**
   * Fetch a single task by ID
   */
  async getTaskById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return await handleResponse(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server.');
      }
      throw error;
    }
  },

  /**
   * Fetch task statistics (total, pending, completed)
   */
  async getStats() {
    try {
      const response = await fetch(`${BASE_URL}/stats`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return await handleResponse(response);
    } catch (error) {
      // Non-blocking fallback if stats endpoint has issue
      return null;
    }
  },

  /**
   * Create a new task
   */
  async createTask(taskData) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      return await handleResponse(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Make sure Spring Boot backend is running.');
      }
      throw error;
    }
  },

  /**
   * Update an existing task
   */
  async updateTask(id, taskData) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      return await handleResponse(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server.');
      }
      throw error;
    }
  },

  /**
   * Toggle task status between PENDING and COMPLETED
   */
  async toggleTaskStatus(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' }
      });
      return await handleResponse(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server.');
      }
      throw error;
    }
  },

  /**
   * Delete a task by ID
   */
  async deleteTask(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      return await handleResponse(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server.');
      }
      throw error;
    }
  }
};
