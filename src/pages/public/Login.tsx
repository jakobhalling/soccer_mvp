import React from 'react';
import { 
  Form, 
  TextInput, 
  Button, 
  Stack, 
  Tile 
} from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For prototype, just check if fields are not empty
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // Call login function from auth context (dummy for prototype)
    login(username, password);
    
    // Navigate to admin page
    navigate('/admin');
  };
  
  return (
    <div className="login-page">
      <Tile className="login-container">
        <h1>Login</h1>
        <p>Enter your credentials to access the admin area</p>
        
        <Form onSubmit={handleSubmit}>
          <Stack gap={5}>
            {error && <div className="error-message">{error}</div>}
            
            <TextInput
              id="username"
              labelText="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
            <TextInput
              id="password"
              labelText="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button type="submit">Login</Button>
            
            <p className="login-note">
              Note: For this prototype, any non-empty username and password will work.
            </p>
          </Stack>
        </Form>
      </Tile>
    </div>
  );
};

export default Login;
