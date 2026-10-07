"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore, SeatInfo, SnackCartItem } from '@/store/bookingStore';
import { Clock, Ticket, ShieldCheck, CreditCard, Wallet, Smartphone, ChevronRight, ChefHat, Sparkles, Check, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSuccessChime } from '@/lib/sound';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  seatLockExpiresAt: number;
  isUpgraded?: boolean;
  appliedPromo?: string | null;
  discountAmount?: number;
  createdAt: number;
}

export default function CheckoutPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  
  // Zustand Store
  const { 
    selectedSeats, 
    seatLockExpiresAt, 
    clearBooking, 
    movieTitle, 
    theatreName, 
    showDate, 
    showTime, 
    selectedSnacks,
    isUpgraded,
    appliedPromo,
    discountAmount,
    toggleUpgrade,
    applyPromoCode,
    removePromoCode
  } = useBookingStore();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  
  // Database state
  const [dbBooking, setDbBooking] = useState<DBBooking | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking details on mount to support refreshing
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const docRef = doc(db, 'bookings', unwrappedParams.bookingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as DBBooking;
          setDbBooking(data);
          
          // Sync database state to Zustand local state if present
          if (data.isUpgraded !== undefined && data.isUpgraded !== isUpgraded) {
            // Use Zustand toggle to sync without database writes loops
            if (data.isUpgraded) toggleUpgrade();
          }
          if (data.appliedPromo) {
            applyPromoCode(data.appliedPromo);
          }
        }
      } catch (err) {
        console.error("Error fetching booking in checkout screen:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [unwrappedParams.bookingId]);

  // Derived values from Firestore or Zustand fallback
  const resolvedSeats = dbBooking?.selectedSeats || selectedSeats;
  const resolvedMovieTitle = dbBooking?.movieTitle || movieTitle || 'DUNE: PART TWO';
  const resolvedTheatreName = dbBooking?.theatreName || theatreName || "PVR Cinemas";
  const resolvedShowDate = dbBooking?.showDate || showDate || "Today";
  const resolvedShowTime = dbBooking?.showTime || showTime || "09:30 PM";
  const resolvedExpiresAt = dbBooking?.seatLockExpiresAt || seatLockExpiresAt;
  
  // Local state or DB state
  const resolvedIsUpgraded = dbBooking?.isUpgraded !== undefined ? dbBooking.isUpgraded : isUpgraded;
  const resolvedAppliedPromo = dbBooking?.appliedPromo !== undefined ? dbBooking.appliedPromo : appliedPromo;
  const resolvedDiscountAmount = dbBooking?.discountAmount !== undefined ? dbBooking.discountAmount : discountAmount;
  const resolvedSnacks = dbBooking?.selectedSnacks || selectedSnacks || [];

  // Calculate totals
  const ticketCount = resolvedSeats.length;
  const ticketTotal = resolvedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const convenienceFee = ticketCount > 0 ? ticketCount * 30 : 0;
  const gst = convenienceFee * 0.18;
  
  // Upgradation Fee (₹150 per ticket)
  const vipUpgradeFee = resolvedIsUpgraded ? ticketCount * 150 : 0;

  // Snacks Total (including Free Coke if upgraded)
  const snacksTotal = resolvedSnacks.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const snacksGst = snacksTotal * 0.05; // 5% GST on snacks
  
  const grandTotal = Math.max(0, ticketTotal + convenienceFee + gst + vipUpgradeFee + snacksTotal + snacksGst - resolvedDiscountAmount);

  useEffect(() => {
    if (!resolvedExpiresAt || resolvedSeats.length === 0) {
      if (!loading && !dbBooking) {
        router.push('/');
      }
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((resolvedExpiresAt - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        clearInterval(interval);
        clearBooking();
        alert('Seat reservation expired!');
        router.push('/');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resolvedExpiresAt, resolvedSeats.length, router, clearBooking, loading, dbBooking]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Check if date falls on Saturday or Sunday
  const isWeekend = (dateStr: string | null) => {
    if (!dateStr) return false;
    try {
      const fullDateStr = dateStr.includes('202') ? dateStr : `${dateStr} 2026`;
      const d = new Date(fullDateStr);
      const day = d.getDay();
      return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    } catch (e) {
      return false;
    }
  };

  const handleToggleUpgrade = async () => {
    await toggleUpgrade(unwrappedParams.bookingId);
    // Reload local dbBooking with updated values
    setDbBooking(prev => {
      if (!prev) return null;
      
      const nextUpgraded = !prev.isUpgraded;
      let nextSnacks = prev.selectedSnacks ? [...prev.selectedSnacks] : [];
      if (nextUpgraded) {
        const freeCoke: SnackCartItem = {
          id: 'free-coke',
          name: 'Chilled Coca-Cola (VIP Freebie)',
          price: 0,
          quantity: ticketCount,
          image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=100&auto=format&fit=crop'
        };
        nextSnacks = nextSnacks.filter(s => s.id !== 'free-coke');
        nextSnacks.push(freeCoke);
      } else {
        nextSnacks = nextSnacks.filter(s => s.id !== 'free-coke');
      }

      return {
        ...prev,
        isUpgraded: nextUpgraded,
        selectedSnacks: nextSnacks
      };
    });
  };

  const handleApplyPromo = async (code: string) => {
    setPromoError(null);
    const success = await applyPromoCode(code, unwrappedParams.bookingId);
    if (success) {
      setPromoInput('');
      
      // Calculate discount amount locally to update dbBooking state
      let disc = 0;
      if (code === 'WEEKEND50') disc = ticketCount * 50;
      else if (code === 'DISCOUNT10') disc = Math.round(ticketTotal * 0.10);
      else if (code === 'WELCOME100') disc = 100;

      setDbBooking(prev => prev ? { ...prev, appliedPromo: code.toUpperCase(), discountAmount: disc } : null);
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleRemovePromo = async () => {
    await removePromoCode(unwrappedParams.bookingId);
    setDbBooking(prev => prev ? { ...prev, appliedPromo: null, discountAmount: 0 } : null);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate Razorpay/Stripe processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    playSuccessChime();
    router.push(`/checkout/success?bookingId=${unwrappedParams.bookingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (resolvedSeats.length === 0) return null;

  const weekend = isWeekend(resolvedShowDate);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-surface border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Checkout</h1>
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full text-sm font-medium border border-red-500/20">
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Upgrades */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Order Info Card */}
          <div className="bg-surface/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-2 text-white">{resolvedMovieTitle}</h2>
            <p className="text-gray-400 text-sm mb-4">{resolvedTheatreName} • {resolvedShowDate}, {resolvedShowTime}</p>
            <div className="flex flex-wrap gap-2">
              {resolvedSeats.map(seat => (
                <span key={seat.id} className="bg-white/5 border border-white/10 px-3 py-1 rounded-md text-sm font-semibold text-gray-200">
                  {seat.row}-{seat.number}
                </span>
              ))}
            </div>
          </div>

          {/* Box Office Gold Class VIP Upgrade Card */}
          <div 
            className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
              resolvedIsUpgraded 
                ? 'bg-gradient-to-r from-surface to-accent/15 border-accent shadow-glow-accent' 
                : 'bg-surface/50 border-white/10 hover:border-primary/30'
            }`}
          >
            {resolvedIsUpgraded && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-[20px] pointer-events-none" />
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-accent/15 border border-accent/30 text-accent text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit">
                  <Sparkles className="w-3 h-3" /> Gold Class VIP Lounge
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Upgrade to Box Office Gold Class</h3>
                <p className="text-xs text-gray-400 leading-relaxed mt-1">
                  Elevate your booking to VIP Recliners. Get priority counter access, luxurious legroom, and a **FREE Ice Cold Coca-Cola (Large)** for each ticket!
                </p>
                <div className="bg-accent/5 text-accent text-[10px] font-bold border border-accent/10 px-3 py-1.5 rounded-lg flex items-center gap-2 mt-3 w-fit">
                  <Gift className="w-3.5 h-3.5" /> Bonus: Free Coke included!
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Upgrade Fee</p>
                  <p className="text-lg font-black text-accent">₹{ticketCount * 150}</p>
                </div>
                <button
                  onClick={handleToggleUpgrade}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    resolvedIsUpgraded 
                      ? 'bg-accent text-neutral-950 shadow-md font-black' 
                      : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                  }`}
                >
                  {resolvedIsUpgraded ? 'Upgraded ✓' : 'Upgrade Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Selected Snacks Info Card (Only if ordered) */}
          {resolvedSnacks.length > 0 && (
            <div className="bg-surface/50 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <ChefHat className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider text-xs">Food & Beverages</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resolvedSnacks.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-xl border border-white/5">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-primary-light">
                      {item.price === 0 ? 'FREE' : `₹${item.price * item.quantity}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offers & Promo Code */}
          <div className="bg-surface/50 border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Ticket className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-white">Promo Codes & Offers</h3>
              </div>

              {resolvedAppliedPromo ? (
                <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-accent uppercase tracking-wider font-bold">Applied Promotion</span>
                    <p className="font-mono text-base font-bold text-white">{resolvedAppliedPromo}</p>
                    <p className="text-xs text-primary-light mt-0.5">₹{resolvedDiscountAmount} saved on this order!</p>
                  </div>
                  <button 
                    onClick={handleRemovePromo}
                    className="text-red-400 hover:text-red-300 text-xs font-bold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter promo code" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white uppercase"
                    />
                    <button 
                      onClick={() => handleApplyPromo(promoInput)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 rounded-xl text-sm font-semibold transition-colors text-white"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-red-400 text-xs font-semibold pl-1">{promoError}</p>}
                </div>
              )}
            </div>

            {/* Clickable Offers Panel */}
            {!resolvedAppliedPromo && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested Offers for You</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Weekend Offer */}
                  <button
                    onClick={() => handleApplyPromo('WEEKEND50')}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-28 relative ${
                      weekend 
                        ? 'bg-accent/5 border-accent text-accent shadow-sm' 
                        : 'bg-transparent border-white/5 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center w-full">
                        <span className="font-mono font-black text-sm text-white">WEEKEND50</span>
                        {weekend && (
                          <span className="bg-accent text-neutral-950 text-[7px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">
                            Available Today
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                        Flat **₹50 Off** per ticket on Saturday & Sunday shows.
                      </p>
                    </div>
                    {weekend && <span className="text-[9px] text-accent font-bold mt-2 underline">Click to Apply</span>}
                  </button>

                  {/* 10% Discount Offer */}
                  <button
                    onClick={() => handleApplyPromo('DISCOUNT10')}
                    className="p-4 rounded-xl border border-white/5 bg-transparent text-left hover:border-white/20 transition-all flex flex-col justify-between h-28"
                  >
                    <div>
                      <span className="font-mono font-black text-sm text-white">DISCOUNT10</span>
                      <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                        Get **10% Off** on total ticket ticket value. Recommended for large groups!
                      </p>
                    </div>
                    <span className="text-[9px] text-accent font-bold underline">Click to Apply</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-surface/50 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Payment Method</h3>
            </div>
            
            <div className="divide-y divide-white/5">
              {[
                { id: 'upi', icon: Smartphone, label: 'UPI / Google Pay / PhonePe' },
                { id: 'card', icon: CreditCard, label: 'Credit / Debit Card' },
                { id: 'wallet', icon: Wallet, label: 'Wallets / Paytm' },
              ].map((method) => (
                <label key={method.id} className="flex items-center p-4 hover:bg-white/5 cursor-pointer transition-colors">
                  <input type="radio" name="payment" className="w-4 h-4 text-accent bg-background border-white/20 focus:ring-accent" defaultChecked={method.id === 'upi'} />
                  <div className="ml-4 flex items-center gap-3">
                    <method.icon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-200">{method.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Price Breakdown */}
        <div className="space-y-6">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 sticky top-24 shadow-glass">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Booking Summary</h3>
            
            <div className="space-y-4 text-sm">
              {/* Tickets */}
              <div className="flex justify-between text-gray-300">
                <span>Tickets ({ticketCount})</span>
                <span>₹{ticketTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Ticket Convenience Fee</span>
                <span>₹{convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>

              {/* VIP Upgrade Fee */}
              {resolvedIsUpgraded && (
                <div className="flex justify-between text-accent font-semibold">
                  <span>VIP Gold Class Upgrade</span>
                  <span>+₹{vipUpgradeFee.toFixed(2)}</span>
                </div>
              )}

              {/* Snacks Summary */}
              {snacksTotal > 0 && (
                <>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between text-gray-300">
                    <span>Pre-ordered Snacks</span>
                    <span>₹{snacksTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Snacks GST (5%)</span>
                    <span>₹{snacksGst.toFixed(2)}</span>
                  </div>
                </>
              )}

              {/* Promotion Discounts */}
              {resolvedDiscountAmount > 0 && (
                <>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Offer Discount ({resolvedAppliedPromo})</span>
                    <span>-₹{resolvedDiscountAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              <div className="h-px bg-white/10 my-4" />
              
              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-white">Amount Payable</span>
                <span className="text-2xl font-black text-primary-light">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent text-neutral-950 py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-glow-accent transition-all disabled:opacity-70 uppercase tracking-wider text-sm"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                ) : (
                  <>Pay ₹{grandTotal.toFixed(2)} <ChevronRight className="w-5 h-5" /></>
                )}
              </motion.button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
