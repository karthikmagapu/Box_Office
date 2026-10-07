"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const Screen = () => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center mb-8 relative">
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-accent/15 to-transparent blur-2xl opacity-50 pointer-events-none" />
      <svg viewBox="0 0 800 100" className="w-full h-auto drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
        <path
          d="M 50 80 Q 400 10 750 80"
          fill="none"
          stroke="url(#screen-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="screen-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6B3E" />
            <stop offset="50%" stopColor="#F9F5E8" />
            <stop offset="100%" stopColor="#8A6B3E" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-accent tracking-[0.5em] text-sm font-semibold uppercase drop-shadow-md"
      >
        Screen This Way
      </motion.div>
    </div>
  );
};

export const LegendItem = ({ colorClass, label }: { colorClass: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-t-sm rounded-b-[2px] border ${colorClass}`} />
    <span className="text-xs sm:text-sm text-gray-300 font-medium">{label}</span>
  </div>
);

export const Legend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 px-6 bg-surface/50 backdrop-blur-md rounded-2xl border border-primary/10 mb-8">
      <LegendItem colorClass="bg-surface border-white/35" label="Available" />
      <LegendItem colorClass="bg-accent border-accent shadow-[0_0_12px_rgba(212,175,55,0.4)]" label="Selected" />
      <LegendItem colorClass="bg-occupied border-gray-800 opacity-50" label="Sold" />
    </div>
  );
};
