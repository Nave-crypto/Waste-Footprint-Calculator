import React from 'react';
import { FaChartBar, FaLeaf, FaLightbulb, FaRecycle } from 'react-icons/fa';

const Home = ({ onStart }) => {
  return (
    <div className="min-h-screen home-bg relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-emerald-900/30 to-slate-950/90"></div>
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(167,243,208,0.35),transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.24),transparent_40%)]" />

      <div className="container mx-auto px-6 py-28 relative z-20">
        <div className="max-w-6xl mx-auto glass-panel rounded-[2rem] p-10 lg:p-14 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-emerald-100 shadow-sm shadow-emerald-500/10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-emerald-200">🌿</span>
                <span>Designed for sustainable living</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-xl">
                Sustainable decisions start with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-100 to-slate-100">insightful impact data</span>.
              </h1>

              <p className="max-w-xl text-lg text-slate-100/90 leading-relaxed">
                Discover your personal waste footprint with a beautiful, easy-to-use calculator built to inspire greener habits and meaningful change.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onStart}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-2xl shadow-emerald-500/30 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Start Assessment
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/15">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-3">
                    <span className="text-white text-2xl font-bold">5</span>
                  </div>
                  <p className="font-semibold text-white text-sm">Min Setup</p>
                  <p className="mt-1 text-slate-200/80 text-xs">Quick, guided inputs for fast results.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg mb-3">
                    <span className="text-white text-2xl">🎯</span>
                  </div>
                  <p className="font-semibold text-white text-sm">Actionable</p>
                  <p className="mt-1 text-slate-200/80 text-xs">Personal strategies to reduce waste.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg mb-3">
                    <span className="text-white text-2xl">🌿</span>
                  </div>
                  <p className="font-semibold text-white text-sm">Nature UI</p>
                  <p className="mt-1 text-slate-200/80 text-xs">Green glassmorphism design.</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] border border-white/15 bg-slate-950/30 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-3xl">
                <div className="absolute -top-8 right-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="space-y-8">
                  <div className="rounded-3xl bg-white/8 border border-white/10 p-6 backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Insight Preview</p>
                    <h2 className="mt-4 text-3xl font-semibold text-white">Understand your waste with clarity</h2>
                    <p className="mt-4 text-slate-200/75">See daily impact, compare with averages, and uncover the next best steps for your home.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card icon={<FaChartBar />} title="Live metrics" subtitle="Waste, per capita, and impact." />
                    <Card icon={<FaLeaf />} title="Eco actions" subtitle="Custom tips to lower your footprint." />
                    <Card icon={<FaRecycle />} title="Data stories" subtitle="Visual charts for every category." />
                    <Card icon={<FaLightbulb />} title="Smart choices" subtitle="Guide your everyday routines." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
      <div className="text-white text-4xl">{icon}</div>
    </div>
    <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-200/80 max-w-xs">{subtitle}</p>
  </div>
);

export default Home;
