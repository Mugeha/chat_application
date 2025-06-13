import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
  const { user } = useAuth();
  const socket = useRef<Socket | null>(null);
  const [toUser, setToUser] = useState<string>('lucy123'); // hardcoded for now
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  if (!user) {
  return <div className="p-4">You must be logged in to access chat.</div>;
}


  useEffect(() => {
    if (!user) return;

    socket.current = io('http://localhost:5000');
    socket.current.emit('join', user._id);

    socket.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
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
    if (user) fetchMessages();
  }, [user, toUser]);

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

  return (
    <div className="flex h-screen">
      {/* Left Sidebar (Hardcoded for now) */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Contacts</h2>
        <button
          onClick={() => setToUser('lucy123')}
          className={`block w-full text-left px-3 py-2 rounded ${
            toUser === 'lucy123' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
          }`}
        >
          lucy123
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-md max-w-sm ${
                msg.from === user.username ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            className="flex-1 border rounded px-4 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
