import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  requestAccount: async (userData) => {
    const response = await api.post('/auth/request-account', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const accountService = {
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  getBalance: async () => {
    const response = await api.get('/account/balance');
    return response.data;
  },
  deposit: async (amount) => {
    const response = await api.post('/account/deposit', { amount });
    return response.data;
  },
  withdraw: async (amount) => {
    const response = await api.post('/account/withdraw', { amount });
    return response.data;
  },
  transfer: async (transferData) => {
    const response = await api.post('/account/transfer', transferData);
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/account/transactions');
    return response.data;
  }
};

export const adminService = {
  getPendingRequests: async () => {
    const response = await api.get('/admin/requests');
    return response.data;
  },
  approveRequest: async (requestId) => {
    const response = await api.post(`/admin/requests/${requestId}/approve`);
    return response.data;
  },
  rejectRequest: async (requestId) => {
    const response = await api.post(`/admin/requests/${requestId}/reject`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};

export default api;
