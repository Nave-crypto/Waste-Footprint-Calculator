import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaClock, FaLeaf } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const History = ({ token, onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Please sign in to view your history.');
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setHistory(response.data.history || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load history. Please refresh or sign in again.');
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="min-h-screen dashboard-bg py-12 px-4 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/95"></div>
      <div className="relative container mx-auto max-w-6xl">
        <div className="glass-panel rounded-[2rem] p-10 shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold">Saved Assessments</h1>
              <p className="mt-2 text-slate-300 max-w-2xl">
                Review your waste footprint history and track progress across multiple calculations.
              </p>
            </div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:scale-[1.01]"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-300">Loading your history…</div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500 bg-red-500/10 p-6 text-red-200">{error}</div>
          ) : history.length === 0 ? (
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-10 text-slate-300 text-center">
              <FaLeaf className="mx-auto mb-4 text-4xl text-emerald-300" />
              <p className="text-lg font-semibold">No saved assessments yet.</p>
              <p className="mt-2 text-slate-400">Complete an assessment and sign in to save results for later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((entry) => (
                <div key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">{new Date(entry.created_at).toLocaleString()}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Waste footprint result</h2>
                    </div>
                    <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
                      {entry.results.classification}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3 mt-6 text-slate-200">
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Per capita</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{entry.results.per_capita} kg</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Impact score</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{entry.results.weighted_impact_score}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Waste index</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{entry.results.waste_index}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
