import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8000/nutriflow'

const api = axios.create({
  baseURL: API_BASE_URL
})

export const getAuthToken = () => {
  return localStorage.getItem('nutriflow_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
};

// Automatically attach auth token if present
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const inFlightGetRequests = new Map();

export const dedupedGet = (url, config = {}) => {
  // Don't share promises when an AbortSignal is present — sharing across
  // callers means one caller's abort poisons the other's fetch.
  // Also skip dedup when a timeout is specified, since different timeouts
  // should not share the same in-flight promise.
  if (config.signal || config.timeout) {
    return api.get(url, config);
  }
  const key = url + JSON.stringify(config.params || {});
  if (inFlightGetRequests.has(key)) {
    return inFlightGetRequests.get(key);
  }
  const promise = api.get(url, config).finally(() => {
    inFlightGetRequests.delete(key);
  });
  inFlightGetRequests.set(key, promise);
  return promise;
};

export default api;
