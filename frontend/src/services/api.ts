import axios, { AxiosInstance } from 'axios';
import { Sweet, AuthResponse, SweetResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async register(email: string, username: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', {
      email,
      username,
      password,
      confirmPassword,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Sweet endpoints
  async getAllSweets(): Promise<SweetResponse> {
    const response = await this.api.get('/sweets');
    return response.data;
  }

  async getSweetById(id: string): Promise<SweetResponse> {
    const response = await this.api.get(`/sweets/${id}`);
    return response.data;
  }

  async searchSweets(
    name?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<SweetResponse> {
    const params: any = {};
    if (name) params.name = name;
    if (category) params.category = category;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    const response = await this.api.get('/sweets/search', { params });
    return response.data;
  }

  async createSweet(sweetData: Partial<Sweet>): Promise<SweetResponse> {
    const response = await this.api.post('/sweets', sweetData);
    return response.data;
  }

  async updateSweet(id: string, sweetData: Partial<Sweet>): Promise<SweetResponse> {
    const response = await this.api.put(`/sweets/${id}`, sweetData);
    return response.data;
  }

  async deleteSweet(id: string): Promise<SweetResponse> {
    const response = await this.api.delete(`/sweets/${id}`);
    return response.data;
  }

  async purchaseSweet(id: string, quantity: number): Promise<SweetResponse> {
    const response = await this.api.post(`/sweets/${id}/purchase`, { quantity });
    return response.data;
  }

  async restockSweet(id: string, quantity: number): Promise<SweetResponse> {
    const response = await this.api.post(`/sweets/${id}/restock`, { quantity });
    return response.data;
  }
}

export default new ApiService();
