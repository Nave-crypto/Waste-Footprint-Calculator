import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Charts from '../components/Charts';
import Recommendations from '../components/Recommendations';
import { FaTrash, FaUser, FaPercent, FaExclamationTriangle, FaTrophy, FaArrowLeft, FaRedo } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = ({ data, token, onRecalculate, onBackToHome, onHistory }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.post(
      `${API_URL}/calculate`,
      data,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }
    )
      .then(response => {
        setResults(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Unable to calculate results. Please try again.');
        setLoading(false);
      });
  }, [data, token]);

  if (loading) return (
    <div className="min-h-screen dashboard-bg flex items-center justify-center px-4">
      <div className="bg-slate-950/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center max-w-md w-full border border-white/10">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-emerald-400 mx-auto mb-6"></div>
        <h3 className="text-2xl font-bold text-white mb-4">Analyzing Your Impact</h3>
        <p className="text-slate-300 mb-6">Calculating your waste footprint and generating personalized recommendations...</p>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
        </div>
      </div>
    </div>
  );

  const getImpactColor = (classification) => {
    switch (classification) {
      case 'Excellent': return 'from-green-400 to-emerald-500 text-white';
      case 'Good': return 'from-green-300 to-green-500 text-white';
      case 'Moderate': return 'from-yellow-400 to-orange-500 text-white';
      case 'High': return 'from-orange-400 to-red-500 text-white';
      case 'Very High': return 'from-red-400 to-red-600 text-white';
      default: return 'from-gray-400 to-gray-500 text-white';
    }
  };

  const metrics = [
    { icon: FaTrash, value: results.total_waste, label: 'Total Daily Waste (kg)', color: 'from-emerald-400 to-teal-500' },
    { icon: FaUser, value: results.per_capita, label: 'Per Capita (kg/day)', color: 'from-green-400 to-emerald-500' },
    { icon: FaPercent, value: `${results.waste_index}%`, label: 'Waste Index', color: 'from-teal-400 to-cyan-500' },
    { icon: FaExclamationTriangle, value: results.weighted_impact_score, label: 'Impact Score', color: 'from-green-500 to-teal-500' },
    { icon: FaTrophy, value: results.classification, label: 'Classification', color: getImpactColor(results.classification), special: true }
  ];

  return (
    <div className="min-h-screen dashboard-bg py-8 px-4">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="glass-panel rounded-[2rem] p-10 lg:p-14 shadow-2xl shadow-slate-950/40 border border-white/10">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">
                Your Waste Footprint Results
              </h1>
              <p className="text-slate-200/80 text-lg max-w-2xl mx-auto">
                Here's a comprehensive analysis of your environmental impact with actionable insights.
              </p>
              {onHistory && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={onHistory}
                    className="rounded-full bg-white/10 border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    View Saved History
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-8 rounded-3xl border border-red-500 bg-red-500/10 p-6 text-red-200 text-center">
                {error}
              </div>
            )}

            {/* Metrics Cards */}
            <div className="grid md:grid-cols-5 gap-8 mb-12">
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className={`w-24 h-24 bg-gradient-to-br ${metric.color} rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300 mb-4`}>
                      <IconComponent className="text-white text-3xl" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                    <div className="text-slate-200/80 text-sm font-medium">{metric.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <Charts results={results} />

            {/* Recommendations */}
            <Recommendations strategies={results.strategies} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12">
              <button
                onClick={onRecalculate}
                className="group bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                <FaRedo className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Recalculate
              </button>
              <button
                onClick={onBackToHome}
                className="group bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;