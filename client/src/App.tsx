import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';

import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
<Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
