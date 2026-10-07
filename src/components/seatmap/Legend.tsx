"use client";

import React from 'react';

export const LegendItem = ({ colorClass, label }: { colorClass: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-t-sm rounded-b-[2px] border ${colorClass}`} />
    <span className="text-xs sm:text-sm text-gray-300 font-medium">{label}</span>
  </div>
);

export const Legend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 px-6 bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 mb-8">
      <LegendItem colorClass="bg-surface border-white/50" label="Available" />
      <LegendItem colorClass="bg-accent border-accent shadow-[0_0_10px_rgba(16,185,129,0.3)]" label="Selected" />
      <LegendItem colorClass="bg-occupied border-gray-700 opacity-50" label="Sold" />
      
      <div className="w-px h-6 bg-white/10 hidden sm:block" />
      
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-t-sm rounded-b-[2px] border border-platinum bg-surface flex items-center justify-center relative">
           <div className="absolute -top-1 -right-1 bg-wheelchair w-3 h-3 rounded-full flex items-center justify-center">
           </div>
        </div>
        <span className="text-xs sm:text-sm text-gray-300 font-medium">Wheelchair Accessible</span>
      </div>
    </div>
  );
};
