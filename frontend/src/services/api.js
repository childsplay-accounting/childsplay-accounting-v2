/**
 * API service — handles all communication with the FastAPI backend.
 */
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Client endpoints ---

export const clientsApi = {
  /**
   * List clients with optional filters.
   * @param {Object} params - { file_type, search, skip, limit }
   */
  list: (params = {}) => api.get("/clients/", { params }),

  /**
   * Get a single client with all related data.
   * @param {string} id - Client UUID
   */
  get: (id) => api.get(`/clients/${id}`),

  /**
   * Create a new client.
   * @param {Object} data - Client data matching ClientCreate schema
   */
  create: (data) => api.post("/clients/", data),

  /**
   * Update a client's core fields.
   * @param {string} id - Client UUID
   * @param {Object} data - Partial client data
   */
  update: (id, data) => api.put(`/clients/${id}`, data),

  /**
   * Delete a client.
   * @param {string} id - Client UUID
   */
  delete: (id) => api.delete(`/clients/${id}`),
};

export default api;
