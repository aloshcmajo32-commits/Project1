// import './App.js';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Consumerdashboard from './pages/Consumerdashboard/Consumerdashboard.jsx';
import ProviderDashboard from './pages/ProviderDashboard/ProviderDashboard.jsx';

function App(){
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/consumer-dashboard" element={<Consumerdashboard />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />    
      </Routes>
    </BrowserRouter>   
  );

}

export default App