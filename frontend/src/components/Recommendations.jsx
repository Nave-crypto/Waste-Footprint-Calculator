import React from 'react';
import { FaCheckCircle, FaLeaf, FaRecycle, FaLightbulb, FaTree } from 'react-icons/fa';

const Recommendations = ({ strategies }) => {
  const getIcon = (index) => {
    const icons = [FaLeaf, FaRecycle, FaLightbulb, FaTree, FaCheckCircle];
    return icons[index % icons.length];
  };

  const getColor = (index) => {
    const colors = [
      'from-emerald-400 to-teal-500',
      'from-green-400 to-emerald-500',
      'from-teal-400 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-emerald-500 to-green-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Personalized Reduction Strategies
        </h2>
        <p className="text-slate-200/80 text-lg max-w-2xl mx-auto">
          Based on your waste profile, here are tailored recommendations to help you reduce your environmental impact.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {strategies.map((strategy, index) => {
          const IconComponent = getIcon(index);
          const colorClass = getColor(index);
          return (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-2xl group-hover:shadow-3xl transform group-hover:scale-110 transition-all duration-300 mb-4`}>
                <IconComponent className="text-white text-5xl" />
              </div>
              <p className="text-slate-100 text-sm leading-relaxed line-clamp-5 group-hover:text-white transition-colors duration-300">
                {strategy}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <div className="inline-flex items-center bg-gradient-to-r from-emerald-400/20 to-teal-400/20 px-6 py-3 rounded-full border border-emerald-400/50 backdrop-blur-sm">
          <FaTree className="text-emerald-300 mr-2" />
          <span className="text-slate-100 font-semibold">Small changes, big impact – start today!</span>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;