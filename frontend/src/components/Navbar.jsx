import React from 'react';

const Navbar = ({ onBackToHome }) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg flex items-center justify-center text-white text-xl">♻️</div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Eco Insight</p>
            <h1 className="text-lg font-semibold text-white">Waste Footprint Calculator</h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#product" className="transition hover:text-white">Product</a>
          <a href="#about" className="transition hover:text-white">About</a>
          <a href="#reviews" className="transition hover:text-white">Reviews</a>
        </nav>

        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-sm font-medium text-white/90 hover:text-white transition"
            >
              Home
            </button>
          )}
          <button className="hidden md:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]">
            Contact
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;