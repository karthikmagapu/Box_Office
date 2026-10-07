"use client";

import React from 'react';
import { Seat } from './Seat';
import { Screen } from './Screen';
import { SeatInfo } from '@/store/bookingStore';

type LayoutCategory = {
  tier: string;
  price: number;
  rows: {
    id: string;
    seats: { id: string; number: number; status: string; isWheelchair?: boolean }[];
  }[];
};

export const SeatMap = ({ 
  layout, 
  selectedSeats, 
  onToggleSeat 
}: { 
  layout: LayoutCategory[], 
  selectedSeats: SeatInfo[],
  onToggleSeat: (seat: SeatInfo) => void
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 overflow-x-auto hide-scrollbar touch-pan-x touch-pan-y">
      <div className="min-w-[600px] flex flex-col items-center gap-12 pb-24">
        
        <Screen />

        <div className="flex flex-col gap-8 w-full">
          {layout.map((category) => (
            <div key={category.tier} className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <hr className="flex-1 border-gray-800" />
                <span className="font-medium tracking-widest uppercase text-xs">
                  {category.tier} - ₹{category.price}
                </span>
                <hr className="flex-1 border-gray-800" />
              </div>

              <div className="flex flex-col gap-3">
                {category.rows.map((row) => (
                  <div key={row.id} className="flex items-center justify-center gap-4 sm:gap-6">
                    <div className="w-6 text-center font-bold text-gray-500 text-sm">
                      {row.id}
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      {row.seats.map((seat, index) => {
                        const isAisle = index === Math.floor(row.seats.length / 2);
                        const isSelected = selectedSeats.some(s => s.id === seat.id);

                        return (
                          <React.Fragment key={seat.id}>
                            {isAisle && <div className="w-4 sm:w-8" />}
                            <Seat
                              seat={{
                                id: seat.id,
                                number: seat.number,
                                row: row.id,
                                tier: category.tier,
                                price: category.price
                              }}
                              status={isSelected ? 'selected' : seat.status as 'available' | 'selected' | 'occupied'}
                              isWheelchair={seat.isWheelchair}
                              onToggle={onToggleSeat}
                            />
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <div className="w-6 text-center font-bold text-gray-500 text-sm">
                      {row.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
