import { createContext, useContext, useEffect, useState} from 'react';
import React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Define the shape of our context
interface SocketContextType {
  socket: Socket | null;
  socketNull: ()=>void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider:React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useAuth().token;
  const socketNull = () => {
    if (socket) {
      socket.disconnect(); // Disconnect when logging out
      setSocket(null);
    }
  };
  useEffect(() => {
    
      if (socket) {
        socket.disconnect(); // Disconnect when logging out
        setSocket(null);
      }

    if(token){
        const newSocket = io('http://localhost:5000', {
        auth: { token }, // Send JWT in auth
        withCredentials: true,
        });

        setSocket(newSocket);

        const handleBeforeUnload = () => {
          newSocket.emit('page-reload');
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            newSocket.disconnect(); // Cleanup when unmounting
        };
    }
  }, [token]); // Reconnect when token changes

  return (
    <SocketContext.Provider value={{ socket,socketNull }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
