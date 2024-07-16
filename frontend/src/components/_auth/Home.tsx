import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Home() {
  const nav = useNavigate();
  const [roomNumber, setRoomNumber] = useState('');
  const [username, setUsername] = useState('');
  const [isSingle, setIsSingle] = useState(true);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isSingle ? 'chat' : 'chatRandomly';
    const body = isSingle ? { username, roomNumber } : { username };
    
    const response = await fetch(`http://localhost:3000/${endpoint}`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const res = await response.json();
    console.log(res)
    if (res.token) {
      localStorage.setItem('chat_token', res.token);
      nav('/chatroom');
    } else if (res.message) {
      toast.info(res.message);
    } else {
      toast.error('Failed to join the chat.');
    }
  };

  return (
    <>
      <div className="w-[400px] mt-[100px] flex justify-between mx-auto">
        <button onClick={() => setIsSingle(true)} className="font-black text-md border-2 px-4 py-2 hover:bg-[#292a2a] rounded-md border-[#4b4b4b]">
          Join Chat
        </button>
        <button onClick={() => nav('/create-room')} className="font-black text-md border-2 px-4 py-2 hover:bg-[#292a2a] rounded-md border-[#4b4b4b]">
          Create Room
        </button>
        <button onClick={() => setIsSingle(false)} className="font-black text-md border-2 px-4 py-2 hover:bg-[#292a2a] rounded-md border-[#4b4b4b]">
          Chat Randomly
        </button>
      </div>
      <div className="w-[800px] p-[2rem] shadow-xl rounded-lg mx-auto mt-[200px] h-[400px] bg-[#353535]">
        <div className="text-center">
          <p className="font-black text-2xl pt-[20px]">Hey user 👋</p>
        </div>
        <div>
          <form onSubmit={handleClick}>
            <label htmlFor="" className="font-black text-md">
              Enter Name
            </label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} className="w-full p-3 mt-3 focus:outline-none" />
            {isSingle && (
              <>
                <label htmlFor="" className="font-black text-md pt-[30px]">
                  Room number
                </label>
                <input type="text" onChange={(e) => setRoomNumber(e.target.value)} className="w-full p-3 mt-3 focus:outline-none" />
              </>
            )}
            <button className="mt-[20px] w-full bg-green-700 p-4 hover:bg-green-600">Let's Chat</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Home;
