import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/welcome';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/DashBoard';
import SchedulePlanner from "./SchedulePlanner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<SchedulePlanner tasks={tasks} />} />
      </Routes>
    </Router>
  );
}

export default App;
