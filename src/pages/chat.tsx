import React, {useEffect, useState } from 'react';
import axios from 'axios';
import './chat.css';
import { useSocket } from '../context/SocketContext';
import { setAuthToken } from '../utils/api';
import { useParams } from 'react-router-dom';


const friendStates ={
  addFriend: 'Add Friend',
  removeFriend: 'Remove Friend',
  requested: 'Requested',
  accept: 'Accept'
};

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{senderId:'',message:''}]);
  const [isFriend, setIsFriend] = useState(friendStates.addFriend);
  const [messagesLength, setMessagesLength] = useState(3);
  const [recipientName, setRecipientName] = useState('');
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);
  const {roomId} = useParams();
  const userId = localStorage.getItem('userId')
  const jwt = localStorage.getItem('token')
  const us = useSocket();
  const socket = (us?us.socket:null)

  // Check recipient's online status and update recipientId
  const checkRecipientName = async (roomId:string) => {
    try {
      const jwt = localStorage.getItem('token')
      setAuthToken(jwt);
      const chatId = roomId;
      const response = await axios.get(`https://chatapp-backend-y2kv.onrender.com/api/chat/get-recipient-name/${chatId}`,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recipient name:', error);
      return {recipientName:'Anonumous'};
    }
  };
  
  useEffect(() => {
    const checkName = async () => {
      const {recipientName,isOnline,isFriend}  = await checkRecipientName(roomId!);
      setRecipientName(recipientName);
      setIsRecipientOnline(isOnline);
      switch(isFriend){
        case 'requested':
          setIsFriend(friendStates.requested);
          break;
        case 'received':
          setIsFriend(friendStates.accept);
          break;
        case 'Friends':
          setIsFriend(friendStates.removeFriend);
          break;
        case 'Not Friend':
          setIsFriend(friendStates.addFriend);
          break;
        default:
          break;
      }
    };
    if (roomId) {
      checkName();
    }
  }, [roomId]); 
  

  // Listen for messages
  useEffect(() => {
    if (socket && isRecipientOnline) {
      const messageHandler = (data:{senderId:string,message:string}) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        setMessagesLength((prev) => prev + 1);
      };
  
      socket.on("receive-message", messageHandler);
  
      return () => {
        socket.off("receive-message", messageHandler); // Clean up listener on unmount
      };
    }
  }, [socket, isRecipientOnline]);

  //Friend Request Sockets
  useEffect(() => {
    if (socket) {
      const recieveFriendRequestHandler = () => {
        setIsFriend(friendStates.accept);
      };
      const friendRequestAcceptedHandler =()=>{
        setIsFriend(friendStates.removeFriend);
      }
      const friendRequestCancelledHandler =()=>{
        setIsFriend(friendStates.addFriend);
      }
      const friendRemovedHandler =()=>{
        setIsFriend(friendStates.addFriend);
      }
  
      socket.on("friend-request-recieved", recieveFriendRequestHandler);
      socket.on('friend-request-accepted', friendRequestAcceptedHandler);
      socket.on('friend-request-cancelled', friendRequestCancelledHandler);
      socket.on('friend-removed', friendRemovedHandler);
      return () => {
        socket.off("friend-request-recieved", recieveFriendRequestHandler);
        socket.off('friend-request-accepted', friendRequestAcceptedHandler);
        socket.off('friend-request-cancelled', friendRequestCancelledHandler);
        socket.off('friend-removed', friendRemovedHandler); // Clean up listener on unmount
      };
    }
  }, [socket]);

  //get prev messages on login
  useEffect(() => {
    const chatId = roomId;
    const getMessages = async () => {
      try {
        const response = await axios.get(`https://chatapp-backend-y2kv.onrender.com/api/chat/get-messages/${chatId}`,{
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error getting messages:', error);
      }
    };
    getMessages();
  }, [jwt,roomId]);

  //send message
  
  // event is a ts event object
  
  const handleSendMessage = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chatId = roomId;
    if (socket) {
      socket.emit('send-message', {chatId, message });
    } 
    if(userId){
      setMessages([...messages, { senderId: userId, message }]);
      setMessagesLength(messagesLength + 1);
    }
    setMessage('');
  };

  const handleFriends = async () => {
    if(!socket){
      window.location.reload();
      return;
    }
    const chatId = roomId;
    switch(isFriend){
      case friendStates.addFriend:
        socket.emit('add-friend', {chatId});
        setIsFriend(friendStates.requested);
        break;
      case friendStates.removeFriend:
        socket.emit('remove-friend', {chatId});
        setIsFriend(friendStates.addFriend);
        break;
      case friendStates.requested:
        socket.emit('cancel-friend-request',{chatId});
        setIsFriend(friendStates.addFriend);
        break;
      case friendStates.accept:
        socket.emit('accept-friend-request',{chatId});
        setIsFriend(friendStates.removeFriend);
        break;
      default:
        break;
    }
  };
  
  
  return (
    <div className='chat-box'>
      <h2 className='recipient'>
        {recipientName||'Anonymous'} 
        <span className={isRecipientOnline ? 'success' : 'failure'}>{isRecipientOnline ? 'online' : 'offline'}</span>
      </h2>
      <button className='yellow-btn' onClick={handleFriends}>{isFriend}</button>
      <div className='chat-messages'>
        {
          messages.map((msg, index) => (
            <p key={index} className={(msg.senderId===userId)?'own-message message':'not-own-message message'}>{msg.message}</p>
          ))
        }
      </div>
      <form onSubmit={handleSendMessage} className='chat-form'>
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='chat-input'
        />
        <button className='btn'>Send</button>
      </form>
    </div>
  );
};

export default ChatApp;