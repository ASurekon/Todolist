import { Button, Container, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/todos' : '/login');
  };

  return (
    <Container maxWidth="md" sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center'
    }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Todo App
      </Typography>
      <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4 }}>
        {user ? `Hello, ${user.username}!` : 'Manage your tasks efficiently'}
      </Typography>
      <Button 
        variant="contained" 
        size="large"
        onClick={handleGetStarted}
        sx={{ px: 4, py: 2 }}
      >
        {isAuthenticated ? 'Go to Your Todos' : 'Get Started'}
      </Button>
    </Container>
  );
};

export default HomePage;