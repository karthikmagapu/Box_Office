"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { useRouter } from 'next/navigation';

export const BottomCheckoutBar = ({ movieTitle, moviePoster }: { movieTitle: string, moviePoster: string }) => {
  const { selectedSeats, lockSeats } = useBookingStore();
  const router = useRouter();
  const [isLocking, setIsLocking] = React.useState(false);

  const ticketCount = selectedSeats.length;
  const ticketTotal = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const convenienceFee = ticketCount > 0 ? ticketCount * 30 : 0;
  const gst = (convenienceFee * 0.18);
  const grandTotal = ticketTotal + convenienceFee + gst;

  const handleProceed = async () => {
    setIsLocking(true);
    const bookingId = await lockSeats(movieTitle, moviePoster);
    setIsLocking(false);
    router.push(`/snacks/${bookingId}`);
  };

  return (
    <AnimatePresence>
      {ticketCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-white/10 p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">
                {ticketCount} Seat{ticketCount > 1 ? 's' : ''} Selected
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white flex items-baseline gap-1">
                ₹{grandTotal.toFixed(2)}
                <span className="text-xs text-gray-500 font-normal">incl. taxes</span>
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceed}
              disabled={isLocking}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent text-neutral-950 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 shadow-glow-accent transition-all duration-300 group disabled:opacity-50"
            >
              {isLocking ? 'Locking Seats...' : 'Proceed'}
              {!isLocking && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
