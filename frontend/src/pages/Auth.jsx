import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Auth = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const endpoint = `${API_URL}/${mode}`;
      const response = await axios.post(endpoint, { email, password });
      onAuthSuccess(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen form-bg text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95"></div>
      <div className="relative container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto glass-panel rounded-[2rem] p-10 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto">
              {mode === 'login'
                ? 'Access your saved assessments and view your waste history.'
                : 'Create an account to store your waste calculations and track progress over time.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl bg-slate-900/90 border border-slate-700 px-4 py-4 text-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-400"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl bg-slate-900/90 border border-slate-700 px-4 py-4 text-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-400"
                placeholder="Enter a secure password"
                required
              />
            </div>

            {message && <div className="rounded-2xl border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-200">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-emerald-500/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Working…' : mode === 'login' ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-300">
            {mode === 'login' ? (
              <>
                Don’t have an account?{' '}
                <button onClick={() => setMode('register')} className="font-semibold text-white hover:text-emerald-300">
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-semibold text-white hover:text-emerald-300">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
