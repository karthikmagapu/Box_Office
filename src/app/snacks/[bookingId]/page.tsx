"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Armchair, HelpCircle } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { SNACKS, Snack } from '@/data/snacks';

export default function SnacksPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const { 
    selectedSeats, 
    selectedSnacks, 
    addSnack, 
    updateSnackQuantity, 
    saveSnacksToBooking,
    movieTitle,
    theatreName
  } = useBookingStore();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [deliveryMethod, setDeliveryMethod] = useState<'seat' | 'counter'>('seat');
  const [isSaving, setIsSaving] = useState(false);

  // If no seats are selected (e.g., direct navigation), redirect back
  useEffect(() => {
    if (selectedSeats.length === 0) {
      router.push('/');
    }
  }, [selectedSeats, router]);

  const categories = ['All', 'Combos', 'Popcorn', 'Drinks', 'Appetizers'];

  const filteredSnacks = activeCategory === 'All' 
    ? SNACKS 
    : SNACKS.filter(s => s.category === activeCategory);

  const getSnackQuantity = (id: string) => {
    const item = selectedSnacks.find(s => s.id === id);
    return item ? item.quantity : 0;
  };

  const totalItems = selectedSnacks.reduce((acc, item) => acc + item.quantity, 0);
  const snackTotal = selectedSnacks.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleProceed = async () => {
    setIsSaving(true);
    // Write snacks list to Firestore booking
    await saveSnacksToBooking(unwrappedParams.bookingId);
    setIsSaving(false);
    router.push(`/checkout/${unwrappedParams.bookingId}`);
  };

  const handleSkip = async () => {
    setIsSaving(true);
    // Clear any snacks selected and write empty to Firestore
    selectedSnacks.forEach(item => updateSnackQuantity(item.id, 0));
    await saveSnacksToBooking(unwrappedParams.bookingId);
    setIsSaving(false);
    router.push(`/checkout/${unwrappedParams.bookingId}`);
  };

  if (selectedSeats.length === 0) return null;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top Banner */}
      <div className="bg-surface/50 border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Seats
          </button>
          
          <div className="text-center hidden md:block">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Now Booking For</span>
            <h2 className="text-sm font-bold text-white line-clamp-1">{movieTitle} • {theatreName}</h2>
          </div>

          <button 
            onClick={handleSkip} 
            className="text-accent hover:text-accent/80 transition-colors text-sm font-bold"
          >
            Skip to Checkout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Snacks Selector */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <span className="bg-accent/15 border border-accent/30 text-accent text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
              Exclusive Food & Beverages
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Interval Cravings</h1>
            <p className="text-gray-400 text-sm">Pre-order snacks now and get them delivered to your seat or pick them up with zero queue lines.</p>
          </div>

          {/* Delivery Method Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface/30 p-2 rounded-2xl border border-white/5">
            <button
              onClick={() => setDeliveryMethod('seat')}
              className={`p-4 rounded-xl text-left border transition-all flex items-start gap-4 ${deliveryMethod === 'seat' ? 'bg-surface border-accent shadow-glow-accent' : 'bg-transparent border-transparent hover:bg-white/5'}`}
            >
              <div className={`p-2 rounded-lg ${deliveryMethod === 'seat' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-gray-400'}`}>
                <Armchair className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Deliver to My Seat</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">Relax in your seat during interval. Our VIP servers will deliver directly to you.</p>
              </div>
            </button>

            <button
              onClick={() => setDeliveryMethod('counter')}
              className={`p-4 rounded-xl text-left border transition-all flex items-start gap-4 ${deliveryMethod === 'counter' ? 'bg-surface border-accent shadow-glow-accent' : 'bg-transparent border-transparent hover:bg-white/5'}`}
            >
              <div className={`p-2 rounded-lg ${deliveryMethod === 'counter' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-gray-400'}`}>
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Express VIP Pickup</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">Skip the lines entirely. Pick up your ready basket at the VIP Counter during interval.</p>
              </div>
            </button>
          </div>

          {/* Categories Tab Filter */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 border-b border-white/5">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === category ? 'bg-accent text-neutral-950 border-accent font-black shadow-glow-accent' : 'bg-surface/40 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Snacks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSnacks.map(snack => {
              const qty = getSnackQuantity(snack.id);
              return (
                <div 
                  key={snack.id}
                  className="bg-surface/40 border border-white/5 hover:border-primary/20 rounded-2xl p-3 flex gap-4 transition-all duration-300 group"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/20 flex-shrink-0 relative">
                    <img src={snack.image} alt={snack.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {snack.tags?.map((tag, idx) => (
                      <span key={idx} className="absolute top-1 left-1 bg-accent/90 text-neutral-950 font-black text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-accent transition-colors">{snack.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{snack.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-primary-light">₹{snack.price}</span>
                      
                      {qty > 0 ? (
                        <div className="flex items-center bg-surface border border-white/10 rounded-lg p-1">
                          <button 
                            onClick={() => updateSnackQuantity(snack.id, qty - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
                          <button 
                            onClick={() => updateSnackQuantity(snack.id, qty + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addSnack({ id: snack.id, name: snack.name, price: snack.price, image: snack.image })}
                          className="bg-white/5 hover:bg-accent hover:text-neutral-950 border border-white/10 hover:border-accent px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-white/10 rounded-3xl p-6 sticky top-24 shadow-glass space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Order Summary</h2>
            </div>

            {totalItems > 0 ? (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto hide-scrollbar space-y-3 pr-1">
                  {selectedSnacks.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded-xl border border-white/5">
                      <div className="flex-1 pr-3">
                        <p className="font-bold text-white line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">₹{item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-light">₹{item.price * item.quantity}</span>
                        <button 
                          onClick={() => updateSnackQuantity(item.id, 0)}
                          className="text-red-400 hover:text-red-300 text-xs ml-1 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Snack Total</span>
                    <span>₹{snackTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>GST & VAT (5%)</span>
                    <span>₹{(snackTotal * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-white">Food Payable</span>
                    <span className="text-xl font-black text-primary-light">
                      ₹{(snackTotal * 1.05).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 text-xs text-accent/90 flex gap-2">
                  <ChefHat className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    {deliveryMethod === 'seat' 
                      ? `Deliverable to your seat (${selectedSeats.map(s => `${s.row}-${s.number}`).join(', ')}) during the interval break.`
                      : 'Available for Express counter pickup during the interval break.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <ChefHat className="w-12 h-12 text-gray-500 mx-auto stroke-1" />
                <div>
                  <p className="text-gray-400 text-sm font-semibold">No snacks selected yet</p>
                  <p className="text-gray-500 text-xs mt-1">Pre-order to secure food and skip the long interval queues.</p>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleProceed}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent text-neutral-950 py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-glow-accent transition-all duration-300 disabled:opacity-50 uppercase tracking-wider text-sm"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                ) : totalItems > 0 ? (
                  <>Proceed to Payment <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Skip & Go to Payment <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              {totalItems > 0 && (
                <button
                  onClick={handleSkip}
                  disabled={isSaving}
                  className="w-full text-center text-xs text-gray-500 hover:text-gray-300 py-1 transition-colors"
                >
                  Clear Cravings & Skip
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
