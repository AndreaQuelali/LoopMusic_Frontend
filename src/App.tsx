import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './features/home/pages/Home';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import './App.css';
import { useAuth } from './features/auth/AuthContext';
import Genres from './features/genres/pages/Genres';
import Artists from './features/artists/pages/Artists';
import Mixes from './features/mixes/pages/Mixes';
import Favorites from './features/favorites/pages/Favorites';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { token } = useAuth();
  if (!token) {
    // Render login directly for simplicity; could also redirect
    return <Login />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/genres" element={<ProtectedRoute><Genres /></ProtectedRoute>} />
      <Route path="/artists" element={<ProtectedRoute><Artists /></ProtectedRoute>} />
      <Route path="/mixes" element={<ProtectedRoute><Mixes /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
    </Routes>
  );
}
