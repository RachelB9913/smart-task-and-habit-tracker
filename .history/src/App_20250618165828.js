// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Welcome from './components/welcome';
// import Login from './components/Login';
// import Register from './components/Register';
// import './App.css';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Welcome />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes like /dashboard here */}
      </Routes>
    </Router>
  );
}
export default App;
