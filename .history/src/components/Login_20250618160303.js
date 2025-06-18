import { useState } from 'react';
import API from '../services/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PageWrapper from './PageWrapper';



export default function Login() {

    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password
                })
            });

            if (response.ok) {
            const data = await response.text();
            alert('Login success: ' + data);
            navigate('/dashboard'); // or whatever your next page is
            } else {
            alert('Login failed');
            }
        } catch (error) {
            console.error(error);
            alert('Login failed: ' + error.message);
        }
    };

    return (
    <PageWrapper direction="left">
        <div className="form-container">
            <form onSubmit={handleSubmit}>            
                <h2>Login</h2>
                <input name="username" placeholder='Username' onChange={handleChange} required />
                <input type="password" name="password" placeholder='Password' onChange={handleChange} required />
                <button type="submit">Login</button>
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