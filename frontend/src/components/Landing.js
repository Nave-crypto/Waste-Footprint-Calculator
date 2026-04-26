import React from 'react';

const Landing = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
            Waste Footprint Calculator
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Discover your environmental impact and learn how to reduce your waste footprint
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="text-4xl text-primary mb-4">🌍</div>
            <h3 className="text-lg font-semibold mb-2">Calculate Impact</h3>
            <p className="text-gray-600">Measure your daily waste generation and environmental footprint</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="text-4xl text-primary mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Visual Insights</h3>
            <p className="text-gray-600">See your waste breakdown with interactive charts and comparisons</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="text-4xl text-primary mb-4">💡</div>
            <h3 className="text-lg font-semibold mb-2">Actionable Tips</h3>
            <p className="text-gray-600">Get personalized strategies to reduce your environmental impact</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="bg-primary hover:bg-secondary text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Start Assessment
        </button>

        <div className="mt-12 text-gray-500">
          <p>Compare with global averages • Free and anonymous • Takes only 5 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;