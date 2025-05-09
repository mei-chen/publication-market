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
            className="rounded-full border-none bg-blue-600 text-white transition-all flex items-center justify-center hover:bg-blue-700 font-semibold text-lg h-14 px-8 shadow-md hover:shadow-lg gap-2 transform hover:scale-105"
            href="/correlation"
          >
            View Detailed Analysis
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </main>
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Publication Markets | Data Analysis Platform</p>
      </footer>
    </div>
  );
}
