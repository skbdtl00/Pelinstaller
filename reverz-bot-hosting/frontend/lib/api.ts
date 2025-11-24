// API client for Reverz Bot Hosting
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string;
}

export class ApiClient {
  private static getHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private static async request(endpoint: string, options: ApiOptions = {}) {
    const { method = 'GET', body, token } = options;

    const config: RequestInit = {
      method,
      headers: this.getHeaders(token),
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'เกิดข้อผิดพลาด');
    }

    return data;
  }

  // Auth
  static login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  static register(username: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { username, email, password },
    });
  }

  static getCurrentUser(token: string) {
    return this.request('/auth/me', { token });
  }

  // Plans
  static getPlans(token: string) {
    return this.request('/plans', { token });
  }

  static getPlan(id: number, token: string) {
    return this.request(`/plans/${id}`, { token });
  }

  static createPlan(data: any, token: string) {
    return this.request('/plans', {
      method: 'POST',
      body: data,
      token,
    });
  }

  static updatePlan(id: number, data: any, token: string) {
    return this.request(`/plans/${id}`, {
      method: 'PUT',
      body: data,
      token,
    });
  }

  static deletePlan(id: number, token: string) {
    return this.request(`/plans/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Servers
  static getServers(token: string) {
    return this.request('/servers', { token });
  }

  static getServer(id: number, token: string) {
    return this.request(`/servers/${id}`, { token });
  }

  static createServer(data: any, token: string) {
    return this.request('/servers', {
      method: 'POST',
      body: data,
      token,
    });
  }

  static deleteServer(id: number, token: string) {
    return this.request(`/servers/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  static sendPowerAction(id: number, action: string, token: string) {
    return this.request(`/servers/${id}/power`, {
      method: 'POST',
      body: { action },
      token,
    });
  }

  static suspendServer(id: number, token: string) {
    return this.request(`/servers/${id}/suspend`, {
      method: 'POST',
      token,
    });
  }

  static unsuspendServer(id: number, token: string) {
    return this.request(`/servers/${id}/unsuspend`, {
      method: 'POST',
      token,
    });
  }

  // Users (Admin)
  static getUsers(token: string) {
    return this.request('/users', { token });
  }

  static getUser(id: number, token: string) {
    return this.request(`/users/${id}`, { token });
  }

  static createUser(data: any, token: string) {
    return this.request('/users', {
      method: 'POST',
      body: data,
      token,
    });
  }

  static updateUser(id: number, data: any, token: string) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: data,
      token,
    });
  }

  static deleteUser(id: number, token: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  static suspendUser(id: number, token: string) {
    return this.request(`/users/${id}/suspend`, {
      method: 'POST',
      token,
    });
  }

  static unsuspendUser(id: number, token: string) {
    return this.request(`/users/${id}/unsuspend`, {
      method: 'POST',
      token,
    });
  }

  // Config (Admin)
  static getConfig(token: string) {
    return this.request('/config', { token });
  }

  static updateConfig(data: any, token: string) {
    return this.request('/config', {
      method: 'PUT',
      body: data,
      token,
    });
  }

  static getEggTemplates(token: string) {
    return this.request('/config/eggs', { token });
  }

  static createEggTemplate(data: any, token: string) {
    return this.request('/config/eggs', {
      method: 'POST',
      body: data,
      token,
    });
  }

  static updateEggTemplate(id: number, data: any, token: string) {
    return this.request(`/config/eggs/${id}`, {
      method: 'PUT',
      body: data,
      token,
    });
  }

  static deleteEggTemplate(id: number, token: string) {
    return this.request(`/config/eggs/${id}`, {
      method: 'DELETE',
      token,
    });
  }
}
