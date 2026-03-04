'use client';

import React from 'react';
import { useTasks } from '@/context/TaskContext';

export default function RaceControls() {
    const { activeTasks, isRacing, startRace } = useTasks();

    return (
        <div className="p-5 border-b border-white/5 bg-slate-900/60 backdrop-blur-md relative z-10 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4 sm:gap-0">
            <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 drop-shadow-sm">
                    ADHD Grand Prix
                </h1>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-1 font-mono uppercase tracking-wider">Race Control Dashboard</p>
            </div>

            <button
                onClick={startRace}
                disabled={activeTasks.length === 0 || isRacing}
                className="pointer-events-auto group relative flex items-center justify-center px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 shadow-[0_0_20px_-5px_rgba(34,197,94,0.6)] hover:shadow-[0_0_30px_0px_rgba(34,197,94,0.8)] hover:scale-105 active:scale-95 overflow-hidden border-2 border-slate-800 focus:outline-none"
            >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out -translate-x-full skew-x-12"></div>
                <span className="relative text-sm sm:text-lg tracking-widest uppercase font-black drop-shadow-md flex items-center gap-2">
                    {isRacing ? 'Racing' : 'START'}
                    {!isRacing && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>}
                </span>
            </button>
        </div>
    );
}
