interface Props {
  selected: string;
  onSelect: (username: string) => void;
}

const Sidebar = ({ selected, onSelect }: Props) => {
  const users = ['jay', 'mark01', 'admin']; // mock list for now

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Contacts</h2>
      {users.map((user) => (
        <button
          key={user}
          onClick={() => onSelect(user)}
          className={`block w-full text-left px-3 py-2 rounded ${
            selected === user ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
          }`}
        >
          {user}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
