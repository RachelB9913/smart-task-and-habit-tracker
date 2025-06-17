import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Welcome!</h1>
        <p className="text-gray-600 mb-8">Please choose an option below to continue</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>

          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 px-6 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600 transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

