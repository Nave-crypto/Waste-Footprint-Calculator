import React, { useState } from 'react';
import { FaUser, FaTrash, FaRecycle, FaLeaf, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';

const MultiStepForm = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    household: { people: '', location: 'India' },
    waste: { food: 0, plastic: 0, paper: 0, glass: 0, hazardous: 0 },
    habits: { recycling: false, composting: false }
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateData = (section, newData) => {
    setData({ ...data, [section]: { ...data[section], ...newData } });
  };

  const handleComplete = () => {
    onComplete(data);
  };

  return (
    <div className="relative min-h-screen overflow-hidden form-bg text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-emerald-950/10 to-slate-950/95"></div>
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.28),transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(circle_at_bottom,rgba(14,165,233,0.18),transparent_40%)]" />
      <div className="relative container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-[2rem] p-10 lg:p-14 shadow-2xl shadow-slate-950/40 border border-white/10 overflow-hidden">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-emerald-200 mb-4">Sustainable waste assessment</p>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                Calculate your waste footprint with impact-driven guidance
              </h1>
              <p className="mt-5 text-slate-200 max-w-2xl mx-auto text-lg">
                Complete the three-step assessment to receive personalized results and eco-friendly tips.
              </p>
            </div>
            <ProgressBar step={step} />
            <div className="mt-12">
              {step === 1 && <Step1 data={data.household} updateData={(d) => updateData('household', d)} nextStep={nextStep} />}
              {step === 2 && <Step2 data={data.waste} updateData={(d) => updateData('waste', d)} nextStep={nextStep} prevStep={prevStep} />}
              {step === 3 && <Step3 data={data.habits} updateData={(d) => updateData('habits', d)} nextStep={handleComplete} prevStep={prevStep} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ step }) => {
  const steps = [
    { icon: FaUser, label: 'Household' },
    { icon: FaTrash, label: 'Waste' },
    { icon: FaLeaf, label: 'Habits' }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, index) => {
        const IconComponent = s.icon;
        const isActive = index + 1 === step;
        const isCompleted = index + 1 < step;
        return (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
              isCompleted ? 'bg-green-500 border-green-500 text-white' :
              isActive ? 'bg-blue-500 border-blue-500 text-white' :
              'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {isCompleted ? <FaCheck className="text-sm" /> : <IconComponent className="text-sm" />}
            </div>
            <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              {s.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-4 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Step 1: Household Information
const Step1 = ({ data, updateData, nextStep }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'people' ? (value === '' ? '' : Math.max(1, parseInt(value) || 1)) : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.people || formData.people < 1) {
      newErrors.people = 'Number of people must be at least 1';
    }
    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }
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
    <div>
      <h2 className="text-3xl font-bold text-center text-white mb-3">Household Information</h2>
      <p className="text-center text-slate-300 mb-8">Tell us about your household so your results match your lifestyle.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <label className="block text-slate-100 font-semibold mb-3 flex items-center gap-3">
            <FaUser className="text-emerald-300" /> Number of People
          </label>
          <input
            type="number"
            name="people"
            value={formData.people}
            onChange={handleChange}
            placeholder="How many people live in your home?"
            min="1"
            step="1"
            className={`w-full px-4 py-4 rounded-2xl bg-slate-900/90 border ${
              errors.people ? 'border-red-400 bg-red-50/20 text-red-100' : 'border-slate-600 text-white'
            } focus:outline-none focus:ring-4 focus:ring-emerald-400 transition-all duration-300`}
            required
          />
          {errors.people && <p className="text-red-300 text-sm mt-3">{errors.people}</p>}
        </div>
        <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <label className="block text-slate-100 font-semibold mb-3 flex items-center gap-3">
            <FaTrash className="text-cyan-300" /> Location
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-4 py-4 rounded-2xl bg-slate-900/80 border ${
              errors.location ? 'border-red-400 bg-red-50/20 text-red-100' : 'border-slate-700 text-white'
            } focus:outline-none focus:ring-4 focus:ring-cyan-400 transition-all duration-300`}
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Other">Other</option>
          </select>
          {errors.location && <p className="text-red-300 text-sm mt-3">{errors.location}</p>}
        </div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-2xl shadow-emerald-500/30 transition-transform duration-300 hover:-translate-y-0.5"
        >
          Next Step
          <FaArrowRight />
        </button>
      </form>
    </div>
  );
};

// Step 2: Daily Waste Inputs
const Step2 = ({ data, updateData, nextStep, prevStep }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData({ ...formData, [name]: numValue });
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

  const wasteTypes = [
    { key: 'food', label: 'Food Waste', icon: FaLeaf, color: 'text-green-500', max: 5 },
    { key: 'plastic', label: 'Plastic Waste', icon: FaRecycle, color: 'text-blue-500', max: 2 },
    { key: 'paper', label: 'Paper Waste', icon: FaTrash, color: 'text-yellow-500', max: 1 },
    { key: 'glass', label: 'Glass Waste', icon: FaTrash, color: 'text-teal-500', max: 1 },
    { key: 'hazardous', label: 'Hazardous Waste', icon: FaTrash, color: 'text-red-500', max: 0.5 }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-white mb-3">Daily Waste Inputs</h2>
      <p className="text-center text-slate-300 mb-8">Estimate your daily waste in kilograms for each category.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {wasteTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div key={type.key} className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-cyan-400 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-slate-100 font-semibold">
                  <IconComponent className={`${type.color} text-xl`} />
                  {type.label}
                </div>
                <span className="text-slate-300 text-sm">{formData[type.key]} kg</span>
              </div>
              <input
                type="range"
                name={type.key}
                value={formData[type.key]}
                onChange={handleChange}
                min="0"
                max={type.max}
                step="0.1"
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-3">
                <span>0</span>
                <span>{type.max} kg</span>
              </div>
              {errors[type.key] && <p className="text-red-300 text-sm mt-2 flex items-center"><FaTrash className="mr-1" />{errors[type.key]}</p>}
            </div>
          );
        })}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="w-full rounded-full bg-slate-900/80 border border-white/10 text-slate-100 font-semibold py-4 shadow-lg transition-transform duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Previous
          </button>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 text-slate-950 font-semibold py-4 shadow-2xl shadow-emerald-500/30 transition-transform duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Next Step <FaArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
};

// Step 3: Habits
const Step3 = ({ data, updateData, nextStep, prevStep }) => {
  const [formData, setFormData] = useState(data);

  const setHabit = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData(formData);
    nextStep();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-white mb-3">Habits & Lifestyle</h2>
      <p className="text-center text-slate-300 mb-8">Share your current habits so the recommendations match your routine.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="text-slate-100 font-semibold mb-3">Do you recycle regularly?</div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHabit('recycling', true)}
              className={`w-full rounded-2xl py-4 font-semibold transition ${formData.recycling ? 'bg-emerald-400 text-slate-950' : 'bg-slate-900/80 text-slate-200 border border-white/10 hover:bg-slate-800'}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHabit('recycling', false)}
              className={`w-full rounded-2xl py-4 font-semibold transition ${formData.recycling === false ? 'bg-red-500 text-white' : 'bg-slate-900/80 text-slate-200 border border-white/10 hover:bg-slate-800'}`}
            >
              No
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-3">Paper, plastic, glass, and metal items.</p>
        </div>
        <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="text-slate-100 font-semibold mb-3">Do you compost organic waste?</div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHabit('composting', true)}
              className={`w-full rounded-2xl py-4 font-semibold transition ${formData.composting ? 'bg-emerald-400 text-slate-950' : 'bg-slate-900/80 text-slate-200 border border-white/10 hover:bg-slate-800'}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHabit('composting', false)}
              className={`w-full rounded-2xl py-4 font-semibold transition ${formData.composting === false ? 'bg-red-500 text-white' : 'bg-slate-900/80 text-slate-200 border border-white/10 hover:bg-slate-800'}`}
            >
              No
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-3">Food scraps, yard waste, and kitchen leftovers.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="w-full rounded-full bg-slate-900/80 border border-white/10 text-slate-100 font-semibold py-4 shadow-lg transition-transform duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Previous
          </button>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 text-slate-950 font-semibold py-4 shadow-2xl shadow-emerald-500/30 transition-transform duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Calculate My Impact
            <FaCheck className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;