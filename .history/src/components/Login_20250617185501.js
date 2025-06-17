import { useState } from 'react';
import API from '../services/api';

export default function Login() {

    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await API.post('/auth/login', formData);
            alert('Login successful!\nToken: ' + res.data.token);
        }
        catch (err){
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} >
            <h2>Login</h2>
            <input name="username" placeholder='Username' onChange={handleChange} required />
            <input type="password" name="password" placeholder='Password' onChange={handleChange} required />
            <button type="submit">Login</button>
            <button
            onClick={() => navigate('/welcome')}
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition duration-200"
          >
            back to Welcome
          </button>
        </form>
    );
}