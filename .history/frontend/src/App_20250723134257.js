import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/welcome';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/DashBoard';
import SchedulePlanner from './components/Schedule/SchedulePlanner'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<SchedulePlanner />} />
      </Routes>
    </Router>
  );
}

export default App;
