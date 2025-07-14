import { useFormik } from 'formik';
import { TextField, Button, Box } from '@mui/material';

interface TodoFormProps {
  onSubmit: (values: { title: string; description?: string }) => void;
}

export const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        margin="normal"
        id="title"
        name="title"
        label="Title"
        value={formik.values.title}
        onChange={formik.handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        id="description"
        name="description"
        label="Description"
        multiline
        rows={4}
        value={formik.values.description}
        onChange={formik.handleChange}
      />
      <Button type="submit" variant="contained" fullWidth>
        Add Todo
      </Button>
    </Box>
  );
};