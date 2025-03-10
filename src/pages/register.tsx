// src/pages/register.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import './login.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUserName]= useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuth().login;

  const handleRegister = async (e: React.FormEvent) => {

    e.preventDefault();
    try {
        if (password !== confirmpassword) {
            throw new Error('Passwords do not match');
        }
        
      const response = await axios.post('http://localhost:5000/api/users/auth/register', {
        username,
        email,
        password,
      });
      login(response.data); // Set the token in the context
      window.location.reload();
    } catch (err: Error|any) {
        if(err instanceof Error) {
            setError(err.message); // "Something went wrong!");
        }
    }
  };

  return (
    <div className='login'>
      <h1 className='title'>Register</h1>
      <button className='btn' onClick={() => navigate('/login')}>Login</button>
      <form className='form-container' onSubmit={handleRegister}>
      <div className='form-group'>
          <label className='form-label'>User Name:</label>
          <input
            type="text"
            value={username}
            className='form-input'
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
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
        <div className='form-group'>
          <label className='form-label'>Confirm Password:</label>
          <input
            type="password"
            value={confirmpassword}
            className='form-input'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className='btn' type="submit">register</button>
      </form>
    </div>
  );
};

export default Register;