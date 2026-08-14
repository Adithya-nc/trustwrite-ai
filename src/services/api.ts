import axios from 'axios';

const metaEnv = (import.meta as any).env || {};
const API_BASE_URL = metaEnv.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const USE_MOCK = metaEnv.VITE_USE_MOCK !== 'false';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('trustwrite-auth');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('trustwrite-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function analyzeEssay(essay: string, title?: string): Promise<any> {
  const response = await apiClient.post('/analyze', { essay, title });
  return response.data;
}

export async function getEssayAnalysis(id: string): Promise<any> {
  const response = await apiClient.get(`/essays/${id}`);
  return response.data;
}

export async function compareEssays(essayA: string, essayB: string, titleA?: string, titleB?: string): Promise<any> {
  const response = await apiClient.post('/compare', { essayA, essayB, titleA, titleB });
  return response.data;
}

export async function batchAnalyzeEssays(essays: Array<{ title: string; text: string; id?: string }>): Promise<any> {
  const response = await apiClient.post('/batch-analyze', { essays });
  return response.data;
}

export async function getAdminStats(): Promise<any> {
  const response = await apiClient.get('/admin/stats');
  return response.data;
}

export async function getAdminUsers(): Promise<any> {
  const response = await apiClient.get('/admin/users');
  return response.data;
}

export async function getAdminAuditLogs(): Promise<any> {
  const response = await apiClient.get('/admin/audit-logs');
  return response.data;
}

export async function getFacultyStats(): Promise<any> {
  const response = await apiClient.get('/faculty/stats');
  return response.data;
}

export default apiClient;

