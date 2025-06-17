import { useState } from 'react';
import API from '../services/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PageWrapper from './PageWrapper';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      alert('User registered!');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <PageWrapper direction="right">
        <div className="form-container">
            <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>
            <button
                onClick={() => navigate('/')}
                className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition duration-200" >
                back to Welcome
            </button>
            </form>
        </div>
    </PageWrapper>
  );
}
