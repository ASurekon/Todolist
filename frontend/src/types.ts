export interface User {
  id: number;
  email: string;
  username: string;
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  is_done: boolean;
  owner_id: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}