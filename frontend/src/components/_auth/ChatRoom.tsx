import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CustomWebSocket extends WebSocket {
  emit: (event: string, data: any) => void;
  listen: (eventName: string, callback: (event: any) => void) => void;
}

function ChatRoom() {
  const socketClientRef = useRef<CustomWebSocket | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<{ text: string, sentByCurrentUser: boolean }[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('chat_token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const socketClient = new WebSocket(`ws://localhost:3000?token=${token}`) as CustomWebSocket;
    socketClientRef.current = socketClient;

    socketClient.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const fs = new FileReader();
        fs.onload = () => {
          const receivedMessage = fs.result as string;
          handleMessageFromServer(receivedMessage, false); // Received message from server
        };
        fs.readAsText(event.data);
      } else {
        const receivedMessage = event.data as string;
        handleMessageFromServer(receivedMessage, false); // Received message from server
      }
    };

    socketClient.onopen = () => {
      console.log('Socket is connected');
    };

    socketClient.onclose = () => {
      console.log('Socket is disconnected');
    };

    socketClient.onerror = (error) => {
      console.error('Socket encountered error:', error);
    };

    return () => {
      socketClient.close();
    };
  }, []);

  const handleMessageFromServer = (message: string, sentByCurrentUser: boolean) => {
    if (!sentByCurrentUser) {
      setReceivedMessages(prev => [...prev, { text: message, sentByCurrentUser }]);
    }
  };

  const handleMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (socketClientRef.current?.readyState === WebSocket.OPEN) {
      socketClientRef.current.send(message);
      handleMessageFromServer(message, true); // Sent message by current user
      setMessage('');
    } else {
      console.log('Socket is not ready to connect');
    }
  };

  const handleInputMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="h-screen w-screen overflow-scroll bg-[#0c1317]">
      <div className="flex justify-around mt-[50px]">
        <h1 className="font-mono">App Name</h1>
        <button className="bg-[#222E35] rounded-lg py-[14px] px-[24px] font-mono" onClick={() => { nav('/video-call') }}>Video Call</button>
      </div>
      <div className="relative w-[1766px] mx-auto overflow-hidden">
        <div className="relative min-h-[800px] mx-auto overflow-scroll w-full mt-[20px] bg-[#0A0E0F]">
          <div className="w-full h-[75px] leading-6 py-[10px] px-[80px] bg-[#171B1D] relative">
            <div>
              <h1 className="text-lg font-black font-mono">Shivansh</h1>
              <span className="text-gray-400 font-mono">{isTyping ? 'Typing...🥵' : 'Online 😍'}</span>
            </div>
            <div className="w-[100%] text-white h-[auto] mt-10 rounded-r-[20px] rounded-b-[20px] rounded-bl-[20px]">
              {receivedMessages.map((msg, index) => (
                <div key={index} className={`flex w-full ${msg.sentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-2 my-4 rounded-lg ${msg.sentByCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sticky bottom-4 h-[59px] bg-[#252B2E]">
          <input
            value={message}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            onChange={handleInputMessage}
            className="w-full h-full p-4 focus:outline-none font-mono"
            type="text"
            placeholder="Type a message"
          />
          <button onClick={handleMessage} className="absolute right-4 top-1/2 transform -translate-y-1/2 px-10 rounded-lg py-2 bg-[#171B1D] font-mono">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
