'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PasswordGate from './components/PasswordGate';

const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-white">Loading map...</div>
});

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('stranded-auth');
    if (auth === 'btc-gives-2026') {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return <PasswordGate onAuth={() => setAuthenticated(true)} />;
  }

  return <MapComponent />;
}