const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include', // Ensure browser always attaches HttpOnly cookies!
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // Extract express-validator error messages if they exist
    const errorMessage = data.errors && data.errors.length > 0 
      ? data.errors[0].msg 
      : (data.message || 'Something went wrong');
    throw new Error(errorMessage);
  }

  return data;
}

// Auth API
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => request('/auth/me'),

  logout: () => request('/auth/logout', { method: 'POST' }),
};

// Tasks API
export const tasksAPI = {
  getAll: (page = 1, limit = 10, status = 'all', search = '') => 
    request(`/tasks?page=${page}&limit=${limit}&status=${status}&search=${search}`),

  create: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  update: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),

  delete: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};
