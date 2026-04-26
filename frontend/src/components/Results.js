import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { FaArrowLeft, FaHome } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Results = ({ data, setStep, setShowingLanding }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    axios.post(`${API_URL}/calculate`, data)
      .then(response => setResults(response.data))
      .catch(error => console.error('Error:', error));
  }, [data]);

  if (!results) return (
    <div className="glass-panel rounded-[2rem] p-10 border border-white/10 text-center">
      <div className="py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
        <p className="text-slate-200/80">Calculating your waste footprint...</p>
      </div>
    </div>
  );

  const pieData = {
    labels: Object.keys(results.waste_breakdown).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: [{
      data: Object.values(results.waste_breakdown),
      backgroundColor: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: ['Your Waste', 'Average'],
    datasets: [{
      label: 'kg/person/day',
      data: [results.per_capita, 0.5],
      backgroundColor: ['#10b981', 'rgba(255,255,255,0.1)'],
      borderColor: ['#10b981', 'rgba(255,255,255,0.2)'],
      borderWidth: 2,
    }],
  };

  const getImpactColor = (classification) => {
    switch (classification) {
      case 'Excellent': return 'from-emerald-500 to-green-500 text-white';
      case 'Good': return 'from-green-500 to-emerald-500 text-white';
      case 'Moderate': return 'from-yellow-500 to-orange-500 text-white';
      case 'High': return 'from-orange-500 to-red-500 text-white';
      case 'Very High': return 'from-red-500 to-red-600 text-white';
      default: return 'from-slate-500 to-slate-600 text-white';
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(226, 232, 240, 0.8)',
          font: { size: 12 },
        },
      },
    },
    scales: {
      y: {
        ticks: { color: 'rgba(226, 232, 240, 0.6)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'rgba(226, 232, 240, 0.6)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-10 lg:p-14 border border-white/10 shadow-2xl shadow-slate-950/40">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Your Waste Footprint Results</h2>
        
        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass-panel rounded-[1.5rem] p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-slate-100 mb-6 text-center">Waste Breakdown</h3>
            <Pie data={pieData} options={chartOptions} />
          </div>
          <div className="glass-panel rounded-[1.5rem] p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-slate-100 mb-6 text-center">Comparison with Average</h3>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <div className="glass-panel rounded-[1.5rem] p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-emerald-300 mb-2">{results.total_waste}</div>
            <div className="text-sm text-slate-200/80">Total Daily Waste (kg)</div>
          </div>
          <div className="glass-panel rounded-[1.5rem] p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-emerald-300 mb-2">{results.per_capita}</div>
            <div className="text-sm text-slate-200/80">Per Capita (kg/day)</div>
          </div>
          <div className="glass-panel rounded-[1.5rem] p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-emerald-300 mb-2">{results.waste_index}%</div>
            <div className="text-sm text-slate-200/80">Waste Index</div>
          </div>
          <div className="glass-panel rounded-[1.5rem] p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-emerald-300 mb-2">{results.weighted_impact_score}</div>
            <div className="text-sm text-slate-200/80">Impact Score</div>
          </div>
          <div className={`bg-gradient-to-br ${getImpactColor(results.classification)} rounded-[1.5rem] p-6 text-center shadow-lg`}>
            <div className="text-3xl font-bold mb-2">{results.classification}</div>
            <div className="text-sm font-semibold">Classification</div>
          </div>
        </div>

        {/* Reduction Strategies */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Personalized Reduction Strategies</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {results.strategies.map((strategy, index) => (
              <div key={index} className="glass-panel rounded-[1.5rem] border border-white/10 p-6 hover:border-emerald-400/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-400/20 text-emerald-300">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-slate-100 leading-relaxed">{strategy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6 border-t border-white/10">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaArrowLeft /> Recalculate
          </button>
          <button
            onClick={() => setShowingLanding(true)}
            className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-2xl border border-white/10 transition-all duration-300 transform hover:scale-105"
          >
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;