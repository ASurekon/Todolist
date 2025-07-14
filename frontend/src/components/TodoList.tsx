import { List, ListItem, Checkbox, ListItemText, IconButton, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Todo } from '../api/todos';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, isDone: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  return (
    <List>
      {todos.map((todo) => (
        <ListItem key={todo.id}>
          <Checkbox
            checked={todo.is_done}
            onChange={(e) => onToggle(todo.id, e.target.checked)}
          />
          <ListItemText
            primary={todo.title}
            secondary={todo.description}
            sx={{ textDecoration: todo.is_done ? 'line-through' : 'none' }}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => onDelete(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};