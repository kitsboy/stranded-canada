'use client';

import { useState } from 'react';

interface PasswordGateProps {
  onAuth: () => void;
}

export default function PasswordGate({ onAuth }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'btcg1ves2026') {
      localStorage.setItem('stranded-auth', 'btc-gives-2026');
      onAuth();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 max-w-md w-full border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Stranded Canada</h1>
        <p className="text-slate-400 text-sm text-center mb-6">Methane Leak Map for Bitcoin Mining Opportunities</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter password..."
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm text-center">Incorrect password</p>
          )}
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors"
          >
            Access Map
          </button>
        </form>
        
        <p className="mt-4 text-xs text-slate-500 text-center">
          Fix the money, fix the world.
        </p>
      </div>
    </div>
  );
}