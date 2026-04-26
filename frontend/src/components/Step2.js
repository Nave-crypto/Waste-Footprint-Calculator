import React, { useState } from 'react';

const Step2 = ({ data, updateData, nextStep, prevStep }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData({ ...formData, [name]: numValue });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] < 0) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} waste cannot be negative`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateData(formData);
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-primary mb-4">Daily Waste Inputs (kg)</h2>
      <form onSubmit={handleSubmit}>
        {['food', 'plastic', 'paper', 'glass', 'hazardous'].map((type) => (
          <div key={type} className="mb-4">
            <label className="block text-gray-700 mb-2 capitalize">{type} Waste</label>
            <input
              type="number"
              name={type}
              value={formData[type]}
              onChange={handleChange}
              min="0"
              step="0.1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors[type] ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors[type] && <p className="text-red-500 text-sm mt-1">{errors[type]}</p>}
          </div>
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Previous
          </button>
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;