import React, { useState } from 'react';

const Step3 = ({ data, updateData, nextStep, prevStep }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData(formData);
    nextStep();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-primary mb-4">Habits</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="recycling"
              checked={formData.recycling}
              onChange={handleChange}
              className="mr-2"
            />
            Do you recycle regularly?
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="composting"
              checked={formData.composting}
              onChange={handleChange}
              className="mr-2"
            />
            Do you compost organic waste?
          </label>
        </div>
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
            Calculate
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3;