"use client";

import React, { useState } from 'react';
import { SeatMap } from '@/components/seatmap/SeatMap';
import { Legend } from '@/components/seatmap/Legend';
import { BottomCheckoutBar } from '@/components/seatmap/BottomCheckoutBar';
import { useBookingStore } from '@/store/bookingStore';

import { MOVIES } from '@/data/movies';

// Dummy layout generator for the new page
const generateDummyLayout = () => {
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  
  const categories = [
    { tier: 'platinum', price: 450, rows: rowLabels.slice(10, 13) },
    { tier: 'gold', price: 300, rows: rowLabels.slice(5, 10) },
    { tier: 'silver', price: 150, rows: rowLabels.slice(0, 5) }
  ];

  return categories.map(cat => ({
    tier: cat.tier,
    price: cat.price,
    rows: cat.rows.map(rowLabel => {
      const numSeats = rowLabel === 'M' ? 14 : 16;
      const seats = Array.from({ length: numSeats }, (_, i) => {
        const number = i + 1;
        const id = `${rowLabel}-${number}`;
        const rand = Math.random();
        let status = 'available';
        if (rand > 0.8) status = 'occupied';
        const isWheelchair = (rowLabel === 'F' && (number === 1 || number === 16));
        return { id, number, status, isWheelchair };
      });
      return { id: rowLabel, seats };
    }).reverse()
  })).reverse();
};

export default function BookSeatPage({ params }: { params: Promise<{ showId: string }> }) {
  const unwrappedParams = React.use(params);
  const [layout] = useState(generateDummyLayout());
  const { selectedSeats, toggleSeat, theatreName, showDate, showTime, showFormat } = useBookingStore();

  const movieId = unwrappedParams.showId.replace('show-', '');
  const movieData = MOVIES.find(m => m.id === movieId) || MOVIES[0];

  return (
    <div className="min-h-screen bg-background pb-32 font-sans selection:bg-primary/30 relative">
      
      {/* Header Info */}
      <div className="pt-8 pb-4 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-white mb-2">{movieData.title}</h1>
        <p className="text-sm text-gray-400">
          {theatreName || "PVR Director's Cut"} • {showDate || "Today"}, {showTime || "09:30 PM"}
        </p>
        {showFormat && <span className="text-xs font-bold text-primary mt-1">{showFormat}</span>}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="mb-8">
          <Legend />
        </div>
        <SeatMap 
          layout={layout} 
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSeat}
        />
      </div>

      <BottomCheckoutBar movieTitle={movieData.title} moviePoster={movieData.poster} />
    </div>
  );
}
