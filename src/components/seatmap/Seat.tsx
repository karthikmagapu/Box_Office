"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { SeatInfo } from '@/store/bookingStore';

interface SeatProps {
  seat: SeatInfo;
  status: 'available' | 'selected' | 'occupied';
  isWheelchair?: boolean;
  onToggle: (seat: SeatInfo) => void;
}

export const Seat = ({ seat, status, isWheelchair, onToggle }: SeatProps) => {
  const isAvailable = status === 'available';
  const isSelected = status === 'selected';
  const isOccupied = status === 'occupied';

  const getSeatColors = () => {
    if (isOccupied) return 'bg-occupied text-gray-500 border-gray-700 opacity-50 cursor-not-allowed';
    if (isSelected) return 'bg-accent text-neutral-950 font-black border-accent shadow-glow-accent';
    
    switch (seat.tier) {
      case 'platinum':
        return 'bg-surface border-platinum text-platinum hover:shadow-[0_0_15px_rgba(229,231,235,0.3)] hover:bg-white/10';
      case 'gold':
        return 'bg-surface border-gold text-gold hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:bg-gold/10';
      case 'silver':
      default:
        return 'bg-surface border-silver text-silver hover:shadow-[0_0_15px_rgba(156,163,175,0.3)] hover:bg-silver/10';
    }
  };

  return (
    <motion.button
      whileHover={isAvailable ? { scale: 1.1, y: -2 } : {}}
      whileTap={isAvailable || isSelected ? { scale: 0.95 } : {}}
      onClick={() => (isAvailable || isSelected) && onToggle(seat)}
      disabled={isOccupied}
      className={cn(
        "relative w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg rounded-b-sm border-2 flex items-center justify-center transition-colors duration-200",
        "group flex-col gap-1",
        getSeatColors()
      )}
      title={`Row ${seat.row} - Seat ${seat.number}`}
    >
      <span className="text-[10px] sm:text-xs font-semibold leading-none">
        {seat.number}
      </span>
      <div className={cn(
        "absolute bottom-1 w-4 h-1 rounded-full",
        isSelected ? "bg-white/50" : "bg-current opacity-30"
      )} />
      {isWheelchair && (
        <div className="absolute -top-2 -right-2 bg-wheelchair w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            <circle cx="12" cy="7" r="2" />
            <path d="M12 9v6" />
            <path d="M9 15h6" />
          </svg>
        </div>
      )}
    </motion.button>
  );
};
