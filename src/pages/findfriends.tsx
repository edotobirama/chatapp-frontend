import React from "react";
import { useState ,useEffect} from "react";
import './findfriends.css';
import { hashArray } from "../utils/api";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
type MatchStatus ={
    status: string;
    chatId?: string;
}


const FindFriends: React.FC = () => {
    const [search, setSearch] = useState("");
    const [types, setTypes] = useState<string[]>([]);
    const [peopleOnline, setPeopleOnline] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);
    const socket = useSocket().socket;
    const nav = useNavigate();
    const findFriendsFunction= async()=>{
      if (!socket) return;
      // Send a request-match event to the backend
      const userId = localStorage.getItem('userId'); // Get the user ID from local storage
      let hashedArray =await hashArray(types) // Replace with the actual hashed array
      socket.emit('request-match', { userId, hashedArray });
    }

    const handleKeyDown=(event:React.KeyboardEvent<HTMLInputElement>)=>{
        if(event.key==='Enter'){
            setTypes([...types,search])
            setSearch('')
        }
    }

    useEffect(() => {
        if (socket) {
          // Listen for activeUsersCount events
          socket.on('activeUsersCount', (count: number) => {
            setPeopleOnline(count);
          });
    
          // Clean up the event listener on unmount
          return () => {
            socket.off('activeUsersCount');
          };
        }
      }, [socket]);

      useEffect(() => {
        if (socket) {
          // Listen for activeUsersCount events
          socket.emit('reqActiveUsersCount')
    
          // Clean up the event listener on unmount
          return () => {
            socket.off('reqActiveUsersCount');
          };
        }
      }, [socket]);
      useEffect(() => {
        if (socket) {
          // Listen for activeUsersCount events
          socket.on('match-status',(ms:MatchStatus)=>{
            if(ms.status==='waiting'){
                setIsWaiting(true);
            }
            else if(ms.status==='cancelled'){
                setIsWaiting(false);
            }
            else{
                setIsWaiting(false);
                nav(`/chat/${ms.chatId}`);
            }
          });
    
          // Clean up the event listener on unmount
          return () => {
            socket.off('match-status');
          };
        }
      }, [socket,nav]);
    
    return (
        <div className="find-friends">
            <h1>Preferences</h1>
            <div className="pref">
                <input type="text" placeholder="Enter Your Preferences Here" className="search-bar" value={search} onChange={(event)=>{
                    setSearch(event.target.value)
                }} onKeyDown={handleKeyDown}/>
                <ul className="types">
                    {
                        types.map((type, index) => (
                            <li key={index} className="list-element">{type}</li>
                        ))
                    }
                </ul>
                <p className="people">People Online: {peopleOnline}</p>
                {isWaiting && <p> Waiting for a match</p>}
                <button className="find-friends-btn" onClick={findFriendsFunction}>{!isWaiting ? <>Find Someone</>:<>Cancel</>}</button>                
            </div>
        </div>
    );

};

export default FindFriends;
