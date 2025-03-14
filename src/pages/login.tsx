// src/pages/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './login.css'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();
  const login = useAuth().login;
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginStatus(true);
      const response = await axios.post('https://chatapp-backend-y2kv.onrender.com/api/users/auth/login', {
        email,
        password,
      });
      login(response.data); // Set the token in the context
      window.location.reload();
    } catch (err) {
      setError('Invalid email or password');
      setLoginStatus(false);
    }
  };

  return (
    <div className = 'login'>
      <h1 className = 'title'>Login</h1>
      <button className='btn' onClick={() => navigate('/register')}>Register</button>
      <form className='form-container' onSubmit={handleLogin}>
        <div className='form-group'>
          <label className='form-label'>Email:</label>
          <input
            type="email"
            value={email}
            className='form-input'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Password:</label>
          <input
            type="password"
            value={password}
            className='form-input'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loginStatus&&<button type="submit" className='btn'>Login</button>}
        {loginStatus && <p style={{ color: 'yellow' }}>Login request is being processed, Please wait...</p>}
      </form>
    </div>
  );
};

export default Login;