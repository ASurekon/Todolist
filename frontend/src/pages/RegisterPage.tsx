import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { login, register } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password1: '',
      password2: '',
    },
    onSubmit: async (values) => {
      if (values.password1 !== values.password2) {
        setError('Passwords do not match');
        return;
      }

      try {
        const user = await register(values);
        const { access_token } = await login({
          username: values.username,
          password: values.password1,
        });
        authLogin(access_token, user);
        navigate('/todos');
      } catch (err) {
        setError('Registration failed. Username or email may be taken.');
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          id="password1"
          name="password1"
          label="Password"
          type="password"
          value={formik.values.password1}
          onChange={formik.handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          id="password2"
          name="password2"
          label="Confirm Password"
          type="password"
          value={formik.values.password2}
          onChange={formik.handleChange}
          required
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </Box>
      <Typography sx={{ mt: 2 }}>
        Already have an account? <Link href="/login">Login</Link>
      </Typography>
    </Box>
  );
};