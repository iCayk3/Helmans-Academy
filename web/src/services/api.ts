const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8088/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const api = {
  getToken(): string | null {
    return localStorage.getItem('ha_token');
  },

  setToken(token: string) {
    localStorage.setItem('ha_token', token);
  },

  removeToken() {
    localStorage.removeItem('ha_token');
    localStorage.removeItem('ha_user');
  },

  getUser() {
    const raw = localStorage.getItem('ha_user');
    return raw ? JSON.parse(raw) : null;
  },

  setUser(user: any) {
    localStorage.setItem('ha_user', JSON.stringify(user));
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.error || 'Ocorreu um erro ao comunicar com o servidor.';
      if (response.status === 401) {
        this.removeToken();
        window.dispatchEvent(new Event('auth-logout'));
      }
      throw new ApiError(errorMsg, response.status);
    }

    return (data?.data !== undefined ? data.data : data) as T;
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },
};
