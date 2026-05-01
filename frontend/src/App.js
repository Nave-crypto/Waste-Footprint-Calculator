import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MultiStepForm from './components/MultiStepForm';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import History from './pages/History';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [assessmentData, setAssessmentData] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('WFC_TOKEN');
    const storedUser = localStorage.getItem('WFC_USER');
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleAuthSuccess = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('WFC_TOKEN', token);
    localStorage.setItem('WFC_USER', JSON.stringify(user));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('WFC_TOKEN');
    localStorage.removeItem('WFC_USER');
    setCurrentPage('home');
  };

  const handleStartAssessment = () => {
    setCurrentPage('form');
  };

  const handleFormComplete = (data) => {
    setAssessmentData(data);
    setCurrentPage('dashboard');
  };

  const handleRecalculate = () => {
    setCurrentPage('form');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setAssessmentData(null);
  };

  return (
    <div className="App">
      <Navbar
        user={user}
        onBackToHome={currentPage !== 'home' ? handleBackToHome : null}
        onLogin={() => setCurrentPage('auth')}
        onHistory={() => setCurrentPage('history')}
        onLogout={handleLogout}
      />
      {currentPage === 'home' && <Home onStart={handleStartAssessment} user={user} onLogin={() => setCurrentPage('auth')} onHistory={() => setCurrentPage('history')} />}
      {currentPage === 'auth' && <Auth onAuthSuccess={handleAuthSuccess} />}
      {currentPage === 'form' && <MultiStepForm onComplete={handleFormComplete} />}
      {currentPage === 'dashboard' && (
        <Dashboard
          data={assessmentData}
          token={token}
          onRecalculate={handleRecalculate}
          onBackToHome={handleBackToHome}
          onHistory={() => setCurrentPage('history')}
        />
      )}
      {currentPage === 'history' && <History token={token} onBack={handleBackToHome} />}
    </div>
  );
}

export default App;