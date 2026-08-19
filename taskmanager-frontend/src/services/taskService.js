import api from './api';

export const taskService = {
  /** GET /api/tasks */
  getAll: async () => {
    const { data } = await api.get('/tasks');
    return data;
  },

  /** GET /api/tasks/{id} */
  getById: async (id) => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  /** POST /api/tasks */
  create: async (payload) => {
    const { data } = await api.post('/tasks', payload);
    return data;
  },

  /** PUT /api/tasks/{id} */
  update: async (id, payload) => {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data;
  },

  /** DELETE /api/tasks/{id} */
  delete: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },

  /** GET /api/tasks/search/{keyword} */
  search: async (keyword) => {
    const { data } = await api.get(`/tasks/search/${encodeURIComponent(keyword)}`);
    return data;
  },

  /** GET /api/tasks/status?status= */
  getByStatus: async (status) => {
    const { data } = await api.get('/tasks/status', { params: { status } });
    return data;
  },

  /** GET /api/tasks/page?page=&size= */
  getPaged: async (page = 0, size = 10) => {
    const { data } = await api.get('/tasks/page', { params: { page, size } });
    return data; // Spring Page object: { content, totalElements, totalPages, ... }
  },

  /** GET /api/tasks/sort */
  getSorted: async () => {
    const { data } = await api.get('/tasks/sort');
    return data;
  },

  /** GET /api/tasks/dashboard (ADMIN only) */
  getDashboard: async () => {
    const { data } = await api.get('/tasks/dashboard');
    return data; // { totalTasks, completedTasks, pendingTasks }
  },

  /** Bulk delete multiple tasks */
  bulkDelete: async (ids) => {
    return Promise.all(ids.map((id) => api.delete(`/tasks/${id}`)));
  },

  /** Bulk complete multiple tasks */
  bulkComplete: async (ids, tasks) => {
    return Promise.all(
      ids.map((id) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return Promise.resolve();
        return api.put(`/tasks/${id}`, { ...task, status: 'COMPLETED' });
      })
    );
  },
};
