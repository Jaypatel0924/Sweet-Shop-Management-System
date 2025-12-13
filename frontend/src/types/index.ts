export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SweetResponse {
  message?: string;
  sweet?: Sweet;
  sweets?: Sweet[];
  count?: number;
}
