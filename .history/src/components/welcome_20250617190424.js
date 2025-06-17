import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Welcome() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 ${fadeIn ? 'fade-in' : ''}`}>
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center animate-pop">
        <h1 className="text-4xl font-bold mb-4 text-indigo-700 animate-pulse-slow">
          👋 Welcome!
        </h1>
        <p className="text-gray-600 mb-8 text-lg">What would you like to do?</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="welcome-btn bg-indigo-600 hover:bg-indigo-700"
          >
            🔐 Login
          </button>

          <button
            onClick={() => navigate('/register')}
            className="welcome-btn bg-purple-500 hover:bg-purple-600"
          >
            📝 Register
          </button>
        </div>
      </div>
    </div>
  );
}
