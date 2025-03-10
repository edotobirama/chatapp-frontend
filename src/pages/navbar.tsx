// should have logo, home, and logout button
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css'
import logo from '../images/logo.png'
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';


const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuth().logout;
  const socketNull = useSocket().socketNull;
  const io = useSocket().socket;
  // to do: add authentication logic for login either via protected route or via context api

  const onLogout = async() => {
    socketNull();
    logout();
    if(io)
    io.disconnect();
    navigate('/login');
  }

  return (
    <div className='navbar'>
      <img src={logo} alt='logo' className='logo' />
      <div className='nav-links'>
        <button className='btn' onClick={() => navigate('/')}>Home</button>
        <button className='btn' onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default NavBar;