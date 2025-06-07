const API_BASE_URL = 'http://localhost:3001/api';

export class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async login(email: string, password: string) {
    const result = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = result.token;
    localStorage.setItem('auth_token', result.token);
    return result;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    const result = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.token = result.token;
    localStorage.setItem('auth_token', result.token);
    return result;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getCourses() {
    return this.request<any[]>('/courses');
  }

  async createCourse(courseData: {
    title: string;
    description: string;
    durationHours: number;
    difficultyLevel: string;
  }) {
    return this.request<any>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async enrollInCourse(courseId: string) {
    try {
      return await this.request<any>(`/courses/${courseId}/enroll`, {
        method: 'POST',
      });
    } catch (error) {
      throw error;
    }
  }

  async getMyEnrollments() {
    return this.request<any[]>('/courses/user/enrolled');
  }

  async updateCourseProgress(courseId: string, progress: number) {
    return this.request<any>(`/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });
  }

  async getProjects() {
    return this.request<any[]>('/projects');
  }

  async createProject(projectData: {
    title: string;
    description: string;
    requiredSkills: string[];
    deadline?: string;
  }) {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getMyProjects() {
    return this.request<any[]>('/projects/user/assigned');
  }

  async updateProjectStatus(projectId: string, status: string) {
    return this.request<any>(`/projects/${projectId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getBadges() {
    return this.request<any[]>('/badges');
  }

  async getMyBadges() {
    return this.request<any>('/badges/my-badges');
  }

  async createBadge(badgeData: {
    name: string;
    description: string;
    icon: string;
    points: number;
    criteria: string;
    color?: string;
  }) {
    return this.request<any>('/badges', {
      method: 'POST',
      body: JSON.stringify(badgeData),
    });
  }

  async calculateBonus() {
    return this.request<any>('/payments/calculate-bonus');
  }

  async createPaymentIntent(amount: number, badgeIds: string[], description: string) {
    return this.request<any>('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, badgeIds, description }),
    });
  }

  async getPaymentHistory() {
    return this.request<any[]>('/payments/history');
  }

  async getDashboardAnalytics() {
    return this.request<any>('/analytics/dashboard');
  }

  async getAdminAnalytics() {
    return this.request<any>('/analytics/admin');
  }

  async getUserProgress(userId: string) {
    return this.request<any>(`/analytics/progress/${userId}`);
  }
}

export const apiClient = new ApiClient();