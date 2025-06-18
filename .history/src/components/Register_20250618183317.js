import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from './PageWrapper';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    document.title = "Register - TaskMaster";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        console.log('Registration successful');
        navigate('/login');
      } else {
        const error = await res.text();
        alert('Registration failed: ' + error);
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="register-background">
      <PageWrapper direction="right">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign up</button>
            <br />
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition duration-200"
            >
              ← Back to Welcome
            </button>
          </form>
        </div>
      </PageWrapper>
    </div>
  );
}


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import './Auth.css';

// export default function Register() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, email, password }),
//       });

//       if (res.ok) {
//         console.log("Registration successful");
//         navigate("/login");
//       } else {
//         const error = await res.text();
//         alert("Registration failed: " + error);
//       }
//     } catch (err) {
//       console.error("Registration error:", err);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
//         <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
//         <button type="submit">Sign up</button>
//       </form>
//       <button onClick={() => navigate("/")}>← Back to Welcome</button>
//     </div>
//   );
// }

