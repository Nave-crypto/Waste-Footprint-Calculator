import React from 'react';

const Navbar = ({ user, onBackToHome, onLogin, onHistory, onLogout }) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg flex items-center justify-center text-white text-xl">♻️</div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Eco Insight</p>
            <h1 className="text-lg font-semibold text-white">Waste Footprint Calculator</h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200/80">
          <button onClick={onHistory} className="transition hover:text-white">History</button>
          {!user && (
            <button onClick={onLogin} className="transition hover:text-white">Sign In</button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-sm font-medium text-slate-100 hover:text-white transition"
            >
              Home
            </button>
          )}
          {user && (
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:scale-[1.02]"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;