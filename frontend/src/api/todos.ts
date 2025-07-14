import api from './axiosConfig';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  is_done: boolean;
  owner_id: number;
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (data: { title: string; description?: string }): Promise<Todo> => {
  const response = await api.post('/todos', data);
  return response.data;
};

export const updateTodo = async (id: number, data: Partial<Todo>): Promise<Todo> => {
  const response = await api.put(`/todos/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};