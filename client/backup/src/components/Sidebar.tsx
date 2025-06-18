import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Props {
  selected: string;
  onSelect: (username: string) => void;
}

interface User {
  _id: string;
  username: string;
}

const Sidebar = ({ selected, onSelect }: Props) => {
  const { user } = useAuth();
  if (!user) return null;

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-r overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Contacts</h2>
      {users.map((u) => (
        <button
          key={u._id}
          onClick={() => onSelect(u.username)}
          className={`block w-full text-left px-3 py-2 rounded ${
            selected === u.username ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
          }`}
        >
          {u.username}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
