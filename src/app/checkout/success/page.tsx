"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Confetti from 'react-confetti';
import { CheckCircle2, Calendar, Share2, Download, QrCode, ChefHat, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookingStore, SeatInfo, SnackCartItem } from '@/store/bookingStore';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { playSuccessChime } from '@/lib/sound';

interface DBBooking {
  bookingId: string;
  movieTitle: string;
  moviePoster: string;
  theatreName: string;
  showTime: string;
  showDate: string;
  showFormat: string;
  selectedSeats: SeatInfo[];
  selectedSnacks?: SnackCartItem[];
  isUpgraded?: boolean;
  appliedPromo?: string | null;
  discountAmount?: number;
  seatLockExpiresAt: number;
  createdAt: number;
}

function SuccessPageContent() {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const { selectedSeats, bookingId, clearBooking, movieTitle, moviePoster, theatreName, showDate, showTime, selectedSnacks, isUpgraded } = useBookingStore();
  const searchParams = useSearchParams();
  const queryBookingId = searchParams.get('bookingId') || bookingId;

  const [dbBooking, setDbBooking] = useState<DBBooking | null>(null);
  const [loading, setLoading] = useState(!!queryBookingId);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    requestAnimationFrame(handleResize);
    
    // Play the success sound chime
    playSuccessChime();
    
    // Auto clear booking state after viewing success to prevent re-checkout
    return () => {
      window.removeEventListener('resize', handleResize);
      clearBooking();
    };
  }, [clearBooking]);

  useEffect(() => {
    if (!queryBookingId) {
      return;
    }
    
    const fetchBooking = async () => {
      try {
        const docRef = doc(db, 'bookings', queryBookingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDbBooking(docSnap.data() as DBBooking);
        }
      } catch (err) {
        console.error("Error fetching booking details in success page:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [queryBookingId]);

  if (!dimensions || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Derive values from dbBooking or fallback to local booking store state
  const resolvedMovieTitle = dbBooking?.movieTitle || movieTitle || 'DUNE: PART TWO';
  const resolvedMoviePoster = dbBooking?.moviePoster || moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop';
  const resolvedTheatreName = dbBooking?.theatreName || theatreName || "PVR Cinemas";
  const resolvedShowDate = dbBooking?.showDate || showDate || "Today";
  const resolvedShowTime = dbBooking?.showTime || showTime || "09:30 PM";
  const resolvedBookingId = dbBooking?.bookingId || queryBookingId || 'BKG-XYZ987';
  const resolvedSeats = dbBooking?.selectedSeats || selectedSeats;
  const resolvedSnacks = dbBooking?.selectedSnacks || selectedSnacks || [];
  
  // Upgraded check
  const resolvedIsUpgraded = dbBooking?.isUpgraded !== undefined ? dbBooking.isUpgraded : isUpgraded;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={400}
        gravity={0.15}
      />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 shadow-glow-accent"
          >
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Booking Confirmed!</h1>
          <p className="text-gray-400">
            {resolvedIsUpgraded 
              ? 'Your Gold Class VIP experience has been secured!' 
              : 'Your ticket and snack vouchers have been issued.'}
          </p>
        </div>

        {/* Ticket Card UI */}
        <div 
          className={`bg-surface border rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 ${
            resolvedIsUpgraded ? 'border-accent shadow-glow-accent' : 'border-white/10'
          }`}
        >
          {/* Gold Class Banner Badge */}
          {resolvedIsUpgraded && (
            <div className="absolute top-3 left-3 bg-accent text-neutral-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5 z-20">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Gold Class VIP
            </div>
          )}

          <div 
            className="h-32 bg-cover bg-center relative" 
            style={{ backgroundImage: `url('${resolvedMoviePoster}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          </div>
          
          <div className="p-6 relative -mt-12">
            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-1">{resolvedMovieTitle}</h2>
            <p className="text-sm text-gray-300 font-medium">{resolvedTheatreName}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="font-bold text-gray-200">{resolvedShowDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time</p>
                <p className="font-bold text-gray-200">{resolvedShowTime}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seats</p>
                <p className="font-bold text-gray-200 text-lg">
                  {resolvedSeats.length > 0 
                    ? resolvedSeats.map((s: SeatInfo) => `${s.row}-${s.number}`).join(', ') 
                    : 'A-1, A-2'}
                </p>
              </div>

              {/* Snacks Section */}
              {resolvedSnacks.length > 0 && (
                <div className="col-span-2 mt-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-accent mb-1.5">
                    <ChefHat className="w-3.5 h-3.5" />
                    <span className="text-xs font-black uppercase tracking-wider">Interval Snacks</span>
                  </div>
                  <p className="font-semibold text-gray-200 text-sm leading-relaxed">
                    {resolvedSnacks.map(s => `${s.name} (x${s.quantity})`).join(', ')}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 italic">
                    In-seat delivery: Row {resolvedSeats[0]?.row || 'A'} during the interval break.
                  </p>
                </div>
              )}
            </div>

            {/* Cutout line effect */}
            <div className="relative flex items-center justify-center my-8">
              <div className="absolute -left-10 w-6 h-6 bg-background rounded-full" />
              <div className="absolute -right-10 w-6 h-6 bg-background rounded-full" />
              <div className="w-full border-t-2 border-dashed border-white/20" />
            </div>

            <div className="flex flex-col items-center">
              <QrCode className="w-32 h-32 text-white mb-2" />
              <p className="text-xs text-gray-500 tracking-widest font-mono">{resolvedBookingId}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-white text-sm">
            <Download className="w-4 h-4" /> Save
          </button>
          <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-white text-sm">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-white text-sm">
            <Calendar className="w-4 h-4" /> Add
          </button>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Link href="/" className="text-primary-light font-medium hover:underline text-sm">
            Back to Home
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
