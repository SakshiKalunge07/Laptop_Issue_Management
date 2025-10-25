import { Issue, Worker, User, UserRole, Brand } from '../types/issue';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json();
  } catch (e) {
    console.error('Failed to parse response:', e);
    throw new Error('Invalid response from server');
  }
}

export const api = {
  // Authentication
  login: async (username: string, password: string): Promise<User> => {
    console.log('Attempting login for:', username);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      console.log('Login response status:', response.status);
      const result = await handleResponse<User>(response);
      console.log('Login successful:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: {
    username: string;
    password: string;
    name: string;
    role: UserRole;
  }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse<User>(response);
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse<User[]>(response);
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return handleResponse<User>(response);
  },

  // Issues
  getIssues: async (filters?: { status?: string; brand?: string }): Promise<Issue[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.brand) params.append('brand', filters.brand);
    
    const url = `${API_BASE_URL}/issues${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse<Issue[]>(response);
  },

  getIssue: async (issueId: string): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}`);
    return handleResponse<Issue>(response);
  },

  createIssue: async (issueData: {
    title: string;
    description: string;
    brand: Brand;
    reported_by: string;
  }): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData)
    });
    return handleResponse<Issue>(response);
  },

  updateIssue: async (issueId: string, updateData: Partial<Issue>): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return handleResponse<Issue>(response);
  },

  assignWorker: async (issueId: string, workerName: string): Promise<{ message: string; issue: Issue }> => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/assign/${encodeURIComponent(workerName)}`, {
      method: 'PUT'
    });
    return handleResponse<{ message: string; issue: Issue }>(response);
  },

  resolveIssue: async (issueId: string): Promise<{ message: string; issue: Issue }> => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/resolve`, {
      method: 'PUT'
    });
    return handleResponse<{ message: string; issue: Issue }>(response);
  },

  deleteIssue: async (issueId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
      method: 'DELETE'
    });
    return handleResponse<{ message: string }>(response);
  },

  // Workers
  getWorkers: async (): Promise<Worker[]> => {
    const response = await fetch(`${API_BASE_URL}/workers`);
    return handleResponse<Worker[]>(response);
  },

  createWorker: async (workerData: { name: string }): Promise<Worker> => {
    const response = await fetch(`${API_BASE_URL}/workers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workerData)
    });
    return handleResponse<Worker>(response);
  },

  // Statistics
  getStatistics: async (): Promise<{
    total_issues: number;
    pending_issues: number;
    resolved_issues: number;
    brand_stats: {
      HP: number;
      Dell: number;
      Asus: number;
    };
  }> => {
    const response = await fetch(`${API_BASE_URL}/statistics`);
    return handleResponse(response);
  }
};