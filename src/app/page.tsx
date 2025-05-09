'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import SP500PublicationChart from './components/charts/SP500PublicationChart';

export default function Home() {
  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);
  return (
    <div className="min-h-screen p-8 pb-20 bg-white">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl text-center font-bold mb-12 mt-8 font-mono tracking-tighter" style={{
          fontFamily: '"Courier Prime", monospace',
          letterSpacing: '-0.05em',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Publication Markets
          </span>
        </h1>
        
        <div className="mb-12">
          <SP500PublicationChart />
        </div>
        
        <div className="flex justify-center mt-8">
          <Link
            className="rounded-full border border-solid border-gray-200 bg-gray-100 transition-colors flex items-center justify-center hover:bg-gray-200 font-medium text-base h-12 px-6"
            href="/correlation"
          >
            View Detailed Analysis
          </Link>
        </div>
      </main>
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Publication Markets | Data Analysis Platform</p>
      </footer>
    </div>
  );
}
