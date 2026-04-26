import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Charts = ({ results }) => {
  // Pie Chart Data - Waste Distribution
  const pieData = {
    labels: Object.keys(results.waste_breakdown).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: [{
      data: Object.values(results.waste_breakdown),
      backgroundColor: [
        '#22c55e', // green-500 - Food
        '#16a34a', // green-600 - Plastic
        '#15803d', // green-700 - Paper
        '#166534', // green-800 - Glass
        '#14532d', // green-900 - Hazardous
      ],
      borderColor: [
        '#16a34a',
        '#15803d',
        '#166534',
        '#14532d',
        '#1f2937',
      ],
      borderWidth: 2,
      hoverOffset: 10,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} kg (${percentage}%)`;
          }
        }
      },
    },
  };

  // Bar Chart Data - Comparison with Indian Average
  const barData = {
    labels: ['Your Waste', 'Indian Average'],
    datasets: [{
      label: 'kg/person/day',
      data: [results.per_capita, 0.5],
      backgroundColor: [
        results.per_capita > 0.5 ? '#dc2626' : '#22c55e', // Red if above average, green if below
        '#e5e7eb' // Gray for average
      ],
      borderColor: [
        results.per_capita > 0.5 ? '#b91c1c' : '#16a34a',
        '#d1d5db'
      ],
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Waste (kg/person/day)',
        },
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const label = context.label;
            if (label === 'Indian Average') {
              return `${label}: ${value} kg (National Standard)`;
            }
            return `${label}: ${value} kg`;
          }
        }
      },
    },
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Visual Analysis</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Waste Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Waste Distribution</h3>
          <div className="h-64">
            <Pie data={pieData} options={pieOptions} />
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Breakdown of your daily waste by category
          </p>
        </div>

        {/* Bar Chart - Comparison */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Comparison with Indian Average</h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Indian average: 0.5 kg/person/day
            </p>
            <p className={`text-sm font-medium mt-1 ${
              results.per_capita > 0.5 ? 'text-red-600' : 'text-green-600'
            }`}>
              {results.per_capita > 0.5
                ? `Your waste is ${(results.per_capita / 0.5 - 1).toFixed(1)}x above average`
                : `Your waste is below average - Great job!`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-accent border-l-4 border-primary p-4 rounded-r-lg">
          <h4 className="font-semibold text-primary mb-2">Key Insights</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Total daily waste: {results.total_waste} kg</li>
            <li>• Per capita waste: {results.per_capita} kg/day</li>
            <li>• Waste index: {results.waste_index}% of average</li>
            <li>• Classification: {results.classification}</li>
          </ul>
        </div>
        <div className="bg-accent border-l-4 border-secondary p-4 rounded-r-lg">
          <h4 className="font-semibold text-primary mb-2">Top Waste Categories</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {Object.entries(results.waste_breakdown)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([category, amount]) => (
                <li key={category}>• {category.charAt(0).toUpperCase() + category.slice(1)}: {amount} kg</li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Charts;