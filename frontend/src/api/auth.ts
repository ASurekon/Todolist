import api from './axiosConfig';

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password1: string;
  password2: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post('/register', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/logout');
};