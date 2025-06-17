import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // or create Login.css

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle API call here
    alert(`Welcome ${formData.username}`);
  };

  return (
    <div className="login-root">
      <header className="login-header">
        <div className="logo-area">
          <svg viewBox="0 0 48 48"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" /></svg>
          <h2>TaskMaster</h2>
        </div>
      </header>

      <div className="login-box">
        <h2>Welcome back</h2>

        <label>
          <p>Username</p>
          <input
            name="username"
            value={formData.username}
            placeholder="Enter your username"
            onChange={handleChange}
          />
        </label>

        <label>
          <p>Password</p>
          <input
            name="password"
            type="password"
            value={formData.password}
            placeholder="Enter your password"
            onChange={handleChange}
          />
        </label>

        <div className="remember-row">
          <p>Remember me</p>
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
          />
        </div>

        <p className="link">Forgot password?</p>

        <button className="login-button" onClick={handleSubmit}>
          Log in
        </button>

        <p className="link text-center">Don't have an account? <span onClick={() => navigate('/register')}>Sign up</span></p>
      </div>
    </div>
  );
}
