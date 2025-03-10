//Home Page
// src/pages/home.tsx
// should have the following content:
// friends list with a search bar
// find friends button
// chats
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import './home.css'
import { useAuth } from '../context/AuthContext';
import { unAuthorised } from '../utils/api';

interface Chat {
  friendName: string;
  chatId: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const jwt = localStorage.getItem('token');
  const logout = useAuth().logout;
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        if(search!==''){
          const response = await axios.get(`http://localhost:5000/api/home/friends/search`, {
            params: { q: search }, // Send search query as a parameter
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          
          setChats(response.data);
        }
        else{
          const response = await axios.get(`http://localhost:5000/api/home/friends`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          setChats(response.data);
        }
        setError('');
      } catch (err:any) {
        unAuthorised(err,logout);
        setError("Error");
      }
    }
    fetchChats();
  }, [search,logout,jwt]);
  return (
    <div className='home'>
      <div className='friends'>
        <div className='friends-list'>
            <input type='search' placeholder='Search friends' className='search-bar' onChange={(e)=>{setSearch(e.target.value)}}/>
            <button className='find-friends-btn' onClick={() => navigate('/find-friends')}>Find New Friends</button>
        </div>
      </div>
      
      <div className='chats'>
        <h2 >Chats</h2>
        
        {
          chats.map((chat, index) => (
            <div key={index} className='chat' onClick={() => navigate(`/chat/${chat.chatId}`)}>
              <p>{chat.friendName}</p>
            </div>
          ))
        }
        {
          error && <p style={{ color: 'red' }}>{error}</p>
        }
      </div>
    </div>
  );
};

export default Home;


