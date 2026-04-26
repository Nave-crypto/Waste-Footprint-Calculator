import React from 'react';

const ProgressBar = ({ step }) => {
  const steps = ['Household', 'Waste Inputs', 'Habits', 'Results'];
  const progress = (step / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((label, index) => (
          <span key={index} className={`text-sm ${index + 1 <= step ? 'text-primary font-semibold' : 'text-gray-400'}`}>
            {label}
          </span>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;