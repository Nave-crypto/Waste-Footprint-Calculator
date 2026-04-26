import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MultiStepForm from './components/MultiStepForm';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'form', 'dashboard'
  const [assessmentData, setAssessmentData] = useState(null);

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
      <Navbar onBackToHome={currentPage !== 'home' ? handleBackToHome : null} />
      {currentPage === 'home' && <Home onStart={handleStartAssessment} />}
      {currentPage === 'form' && <MultiStepForm onComplete={handleFormComplete} />}
      {currentPage === 'dashboard' && (
        <Dashboard
          data={assessmentData}
          onRecalculate={handleRecalculate}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;