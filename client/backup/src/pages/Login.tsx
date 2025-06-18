import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/chat');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', form);
      login(data);
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign in to Chat</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
