import { useNavigate } from 'react-router-dom';
import '../App.css'; // Or create a new Welcome.css if preferred
import { useRef, useState } from "react";
import PageWrapper from './PageWrapper';



export default function Welcome() {
  const navigate = useNavigate();

  return (
    <PageWrapper direction="down">
    <div className="welcome-root">
      <header className="welcome-header">
        <div className="logo-area">
          <svg viewBox="0 0 48 48"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" /></svg>
          <h2>TaskMaster</h2>
        </div>
        <div className="nav-actions">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Sign up</button>
        </div>
      </header>

      <section className="welcome-hero">
        <h1>Organize your life with TaskMaster</h1>
        <p>Smart task and habit tracker to help you achieve your goals. Sign up today.</p>
        <div className="hero-actions">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Sign up</button>
        </div>
      </section>

      <section className="features">
        <h2>FEATURES</h2>
        <p>TaskMaster helps you stay on top of your goals.</p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>📋 Smart Task Management 📋</h3>
            <p>Easily create, organize, and prioritize tasks.</p>
          </div>
          <div className="feature-card">
            <h3>⏰ Time Management ⏰</h3>
            <p>Boost productivity with built-in timers.</p>
          </div>
          <div className="feature-card">
            <h3>📆 Habit Tracking 📆</h3>
            <p>Track your habits and build positive routines.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <h3>What a great day to achieve goals!!!</h3>
      </footer>
    </div>
    </PageWrapper>
  );
}
