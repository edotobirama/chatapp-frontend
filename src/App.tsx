// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Chat from './pages/chat';
import Register from './pages/register';
import Home from './pages/home';
import NavBar from './pages/navbar';
import Layout from './components/layout';
import { useAuth } from './context/AuthContext';
import FindFriends from './pages/findfriends';
const App: React.FC = () => {

  const isAuthenticated =useAuth().isAuthenticated; 
  
  return (
    <Router>
      <Layout>
      <NavBar />
        <Routes>
          <Route path="/login" element={!isAuthenticated ?<Login />:<Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ?<Register />:<Navigate to="/" />} />
          <Route
            path="/chat/:roomId"
            element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
          />
          <Route
            path="/find-friends"
            element={isAuthenticated ? <FindFriends/> : <Navigate to="/login" />}
          />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

