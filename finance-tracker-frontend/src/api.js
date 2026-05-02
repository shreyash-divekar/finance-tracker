import axios from 'axios';

const AUTH_STORAGE_KEY = 'finance-tracker-auth';
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
    }

    return Promise.reject(error);
  }
);

export function getStoredAuth() {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function storeAuth(username) {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      username,
    })
  );
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated() {
  return Boolean(getStoredAuth()?.username);
}

export async function registerUser(credentials) {
  const response = await api.post('/auth/register', credentials);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials);
  storeAuth(response.data.username);
  return response.data;
}

export async function logoutUser() {
  await api.post('/auth/logout');
  clearAuth();
}

export async function getSession() {
  const response = await api.get('/auth/session');
  return response.data;
}

export function getErrorMessage(error, fallbackMessage) {
  const payload = error?.response?.data;

  if (typeof payload === 'string') {
    return payload;
  }

  if (payload?.message) {
    return payload.message;
  }

  return fallbackMessage;
}

export async function getIncomes() {
  const response = await api.get('/api/incomes');
  return response.data;
}

export async function createIncome(payload) {
  const response = await api.post('/api/incomes', payload);
  return response.data;
}

export async function updateIncome(id, payload) {
  const response = await api.put(`/api/incomes/${id}`, payload);
  return response.data;
}

export async function deleteIncome(id) {
  await api.delete(`/api/incomes/${id}`);
}

export async function getExpenses() {
  const response = await api.get('/api/expenses');
  return response.data;
}

export async function createExpense(payload) {
  const response = await api.post('/api/expenses', payload);
  return response.data;
}

export async function updateExpense(id, payload) {
  const response = await api.put(`/api/expenses/${id}`, payload);
  return response.data;
}

export async function deleteExpense(id) {
  await api.delete(`/api/expenses/${id}`);
}

export async function getInvestments() {
  const response = await api.get('/api/investments');
  return response.data;
}

export async function createInvestment(payload) {
  const response = await api.post('/api/investments', payload);
  return response.data;
}

export async function updateInvestment(id, payload) {
  const response = await api.put(`/api/investments/${id}`, payload);
  return response.data;
}

export async function deleteInvestment(id) {
  await api.delete(`/api/investments/${id}`);
}
