import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Registration from './pages/Register/Register';
import Consumerdashboard from './pages/Consumerdashboard/Consumerdashboard';
import ProviderDashboard from './pages/ProviderDashboard/ProviderDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/consumer" element={<Consumerdashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
