import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiClient {
  private demoMode: boolean = false;

  setDemoMode(isDemo: boolean) {
    this.demoMode = isDemo;
  }

  isDemoMode() {
    return this.demoMode;
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('auth_token');
    const companyId = localStorage.getItem('company_id');
    const headers: Record<string, string> = {};
    if (token && !this.demoMode) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const separator = path.includes('?') ? '&' : '?';
    const cId = this.demoMode ? 'demo' : companyId;
    const finalPath = cId ? `${path}${separator}companyId=${cId}` : path;
    
    try {
      const response = await fetch(`${API_BASE_URL}${finalPath}`, { headers });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const json = await response.json();
      return { data: json.data !== undefined ? json.data : json, status: response.status };
    } catch (error: any) {
      return { error: error.message, status: 500 };
    }
  }

  async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('auth_token');
    const companyId = localStorage.getItem('company_id');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token && !this.demoMode) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const separator = path.includes('?') ? '&' : '?';
    const cId = this.demoMode ? 'demo' : companyId;
    const finalPath = cId ? `${path}${separator}companyId=${cId}` : path;

    try {
      const response = await fetch(`${API_BASE_URL}${finalPath}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const json = await response.json();
      return { data: json.data !== undefined ? json.data : json, status: response.status };
    } catch (error: any) {
      return { error: error.message, status: 500 };
    }
  }
}

export const apiClient = new ApiClient();
