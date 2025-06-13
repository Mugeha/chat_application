import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', form);
      login(data);
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4">
    <h2 className="text-2xl font-bold text-center text-green-600">Register</h2>

    <div>
      <label className="block text-sm mb-1">Username</label>
      <input
        type="text"
        placeholder="Choose a username"
        className="w-full px-4 py-2 border rounded-md"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
    </div>

    <div>
      <label className="block text-sm mb-1">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full px-4 py-2 border rounded-md"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
    </div>

    <div>
      <label className="block text-sm mb-1">Password</label>
      <input
        type="password"
        placeholder="Create a password"
        className="w-full px-4 py-2 border rounded-md"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
    </div>

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded-md">
      Register
    </button>
  </form>
</div>


  );
};

export default Register;
