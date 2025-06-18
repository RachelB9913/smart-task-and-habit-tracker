// import { useState } from 'react';
// import API from '../services/api';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import PageWrapper from './PageWrapper';



// export default function Login() {

//     const [formData, setFormData] = useState({ username: '', password: '' });
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://localhost:8080/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 username: formData.username,
//                 password: formData.password
//                 })
//             });

//             if (response.ok) {
//             const data = await response.text();
//             alert('Login success: ' + data);
//             navigate('/dashboard'); // or whatever your next page is
//             } else {
//             alert('Login failed');
//             }
//         } catch (error) {
//             console.error('Full error: ' + error);
//             alert('Login failed: ' + error.message);
//         }
//     };

//     return (
//     <PageWrapper direction="left">
//         <div className="form-container">
//             <form onSubmit={handleSubmit}>            
//                 <h2>Login</h2>
//                 <input name="username" placeholder='Username' onChange={handleChange} required />
//                 <input type="password" name="password" placeholder='Password' onChange={handleChange} required />
//                 <button type="submit">Login</button>
//                 <button
//                     onClick={() => navigate('/')}
//                     className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition duration-200" >
//                     back to Welcome
//                 </button>
//             </form>
//         </div>
//     </PageWrapper>
//     );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Login success:", data);
        // localStorage.setItem("token", data.token); // if using JWT
        navigate("/dashboard");
      } else {
        const error = await res.text();
        alert("Login failed: " + error);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate("/")}>← Back to Welcome</button>
    </div>
  );
}

