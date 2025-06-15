import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MessageBubble from '../components/MessageBubble';
import Sidebar from '../components/Sidebar';

import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
  const { user, logout } = useAuth();
  const socket = useRef<Socket | null>(null);
  const [toUser, setToUser] = useState<string>('lucy123'); // default target
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const [isTyping, setIsTyping] = useState(false);
  const [typingFrom, setTypingFrom] = useState('');

  if (!user) {
    return <div className="p-4">You must be logged in to access chat.</div>;
  }

  useEffect(() => {
    socket.current = io('http://localhost:5000');
    socket.current.emit('join', user._id);

    socket.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.current.on('typing', ({ from }) => {
      setTypingFrom(from);
      setIsTyping(true);
      clearTimeout((socket.current as any)?._typingTimeout);
      (socket.current as any)._typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [user]);

  const fetchMessages = async () => {
    const res = await axios.post(
      'http://localhost:5000/api/messages/get',
      {
        fromEmail: user.email,
        toUsername: toUser,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
  }, [toUser]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const body = {
      fromEmail: user.email,
      toUsername: toUser,
      message,
    };

    await axios.post('http://localhost:5000/api/messages', body, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    socket.current?.emit('send_message', {
      to: toUser,
      from: user.username,
      message,
    });

    setMessages((prev) => [...prev, { from: user.username, message }]);
    setMessage('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socket.current?.emit('typing', {
      to: toUser,
      from: user.username,
    });
  };

  return (
  <div className="flex h-screen relative">
    {/* Logout Button */}
    <button
      onClick={logout}
      className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded shadow-md z-10"
    >
      Logout
    </button>

    {/* Sidebar */}
    <Sidebar selected={toUser} onSelect={setToUser} />

    {/* Chat Panel */}
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b font-semibold text-lg shadow">
        Chatting with <span className="text-blue-600">{toUser}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto flex flex-col bg-white">
        {isTyping && (
          <p className="text-sm italic text-gray-500">{typingFrom} is typing...</p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === user.username ? 'justify-end' : 'justify-start'}`}
          >
            <MessageBubble
              message={msg.message}
              fromSelf={msg.from === user.username}
              avatar={msg.from !== user.username ? '/avatar.jpg' : undefined}
              time={
                msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-4 py-2"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  </div>
);

};

export default Chat;
