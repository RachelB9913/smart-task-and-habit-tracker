// import { useState } from 'react';
// import API from '../services/api';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import PageWrapper from './PageWrapper';

// export default function Register() {
//   const [formData, setFormData] = useState({ username: '', email: '', password: '' });

//   const navigate = useNavigate();
  
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post('/auth/register', formData);
//       alert('User registered!');
//     } catch (err) {
//       alert('Registration failed');
//     }
//   };

//   return (
//     <PageWrapper direction="right">
//         <div className="form-container">
//             <form onSubmit={handleSubmit}>
//             <h2>Register</h2>
//             <input name="username" placeholder="Username" onChange={handleChange} required />
//             <input name="email" placeholder="Email" onChange={handleChange} required />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//             <button type="submit">Register</button>
//             <button
//                 onClick={() => navigate('/')}
//                 className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition duration-200" >
//                 back to Welcome
//             </button>
//             </form>
//         </div>
//     </PageWrapper>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css'; // Optional styling

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        console.log("Registration successful");
        navigate("/login");
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="text" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} required />
        <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
