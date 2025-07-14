import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from '../api/todos';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { Container, Typography, Button, Box } from '@mui/material';

export const TodosPage = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (error) {
        console.error('Failed to load todos', error);
      }
    };
    loadTodos();
  }, []);

  const handleAddTodo = async (values: { title: string; description?: string }) => {
    try {
      const newTodo = await createTodo(values);
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error('Failed to add todo', error);
    }
  };

  const handleToggleTodo = async (id: number, isDone: boolean) => {
    try {
      const updatedTodo = await updateTodo(id, { is_done: isDone });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Failed to update todo', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Welcome, {user?.username}!
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <TodoForm onSubmit={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
    </Container>
  );
};