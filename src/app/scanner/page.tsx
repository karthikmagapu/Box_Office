"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Flashlight, X, ChefHat, Plus, Minus, ShoppingBag, Armchair, Sparkles, QrCode, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SNACKS } from '@/data/snacks';
import { playSuccessChime } from '@/lib/sound';
import Link from 'next/link';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function ScannerHubPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'snacks' | 'scanner'>('snacks');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Scanner state
  const [scanning, setScanning] = useState(true);
  const [scannedSeat, setScannedSeat] = useState<string | null>(null);

  // Cart state for standalone food ordering
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'seat' | 'counter'>('counter');
  const [seatNumber, setSeatNumber] = useState<string>('');
  const [bookingIdInput, setBookingIdInput] = useState<string>('');
  
  // Checkout simulation
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState<{ id: string; total: number; delivery: string } | null>(null);

  // Scan simulation logic
  useEffect(() => {
    if (activeTab !== 'scanner') return;
    
    setScanning(true);
    const timer = setTimeout(() => {
      setScanning(false);
      const mockSeat = `A-${Math.floor(Math.random() * 15) + 1}`;
      setScannedSeat(mockSeat);
      
      // Auto redirect to snacks tab after 1.5s and pre-fill seat
      setTimeout(() => {
        setSeatNumber(mockSeat);
        setDeliveryMethod('seat');
        setActiveTab('snacks');
      }, 1500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const categories = ['All', 'Combos', 'Popcorn', 'Drinks', 'Appetizers'];
  const filteredSnacks = activeCategory === 'All' 
    ? SNACKS 
    : SNACKS.filter(s => s.category === activeCategory);

  // Cart Operations
  const addToCart = (snack: typeof SNACKS[0]) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === snack.id);
      if (exists) {
        return prev.map(item => item.id === snack.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: snack.id, name: snack.name, price: snack.price, quantity: 1, image: snack.image }];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    
    // Simulate API checkout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOrderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setConfirmedOrderDetails({
      id: mockOrderId,
      total: cartTotal * 1.05,
      delivery: deliveryMethod === 'seat' 
        ? `Delivered to Seat ${seatNumber || 'A-12'}` 
        : 'VIP Counter Express Pickup'
    });
    
    playSuccessChime();
    setIsCheckingOut(false);
    setOrderConfirmed(true);
    setCart([]);
  };

  if (orderConfirmed && confirmedOrderDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl relative text-center space-y-6"
        >
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto shadow-glow-accent">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Snacks Confirmed!</h1>
            <p className="text-gray-400 text-sm">Your order is sent to the gourmet kitchen.</p>
          </div>

          {/* Ticket voucher */}
          <div className="bg-background/80 border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Order ID</span>
              <span className="font-bold text-white font-mono">{confirmedOrderDetails.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Fulfilment</span>
              <span className="font-bold text-accent">{confirmedOrderDetails.delivery}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Amount Paid</span>
              <span className="font-bold text-primary-light">₹{confirmedOrderDetails.total.toFixed(2)}</span>
            </div>
            <div className="border-t border-dashed border-white/10 my-4" />
            <div className="flex flex-col items-center justify-center gap-2">
              <QrCode className="w-28 h-28 text-white" />
              <p className="text-[10px] text-gray-500 tracking-wider font-mono">SCAN AT FOOD COUNTER</p>
            </div>
          </div>

          <button 
            onClick={() => {
              setOrderConfirmed(false);
              setConfirmedOrderDetails(null);
            }}
            className="w-full bg-gradient-to-r from-primary to-accent text-neutral-950 py-3.5 rounded-xl font-bold uppercase text-sm tracking-wider"
          >
            Order More Snacks
          </button>
          
          <div>
            <Link href="/" className="text-gray-400 hover:text-white text-xs font-semibold underline">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Tab bar header */}
      <div className="bg-surface/50 border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-white tracking-tighter">
            BOX<span className="text-accent ml-0.5 tracking-wider">OFFICE</span>
          </Link>
          
          {/* Tabs */}
          <div className="flex bg-black/40 border border-white/5 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('snacks')}
              className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'snacks' ? 'bg-accent text-neutral-950 font-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Order Snacks
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'scanner' ? 'bg-accent text-neutral-950 font-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Armrest Scanner
            </button>
          </div>

          <div className="w-16" /> {/* Spacer */}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'snacks' ? (
          <motion.div
            key="snacks-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Menu Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-2">
                <span className="bg-accent/15 border border-accent/30 text-accent text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
                  Gourmet Kitchen
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Order Gourmet Food</h1>
                <p className="text-gray-400 text-sm">Select from our Gold Class snacks menu. Standalone orders welcome for in-theatre dining.</p>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 border-b border-white/5">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === category ? 'bg-accent text-neutral-950 border-accent font-black shadow-glow-accent' : 'bg-surface/40 text-gray-400 border-white/5 hover:border-white/20'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Snacks List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredSnacks.map(snack => {
                  const item = cart.find(c => c.id === snack.id);
                  const qty = item ? item.quantity : 0;
                  return (
                    <div 
                      key={snack.id}
                      className="bg-surface/40 border border-white/5 hover:border-primary/20 rounded-2xl p-3 flex gap-4 transition-all duration-300 group"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/20 flex-shrink-0 relative">
                        <img src={snack.image} alt={snack.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>

                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-accent transition-colors">{snack.name}</h3>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{snack.description}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-primary-light">₹{snack.price}</span>
                          
                          {qty > 0 ? (
                            <div className="flex items-center bg-surface border border-white/10 rounded-lg p-1">
                              <button 
                                onClick={() => updateQuantity(snack.id, qty - 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
                              <button 
                                onClick={() => updateQuantity(snack.id, qty + 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(snack)}
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

            {/* Right Summary Column */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-white/10 rounded-3xl p-6 sticky top-24 shadow-glass space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Gourmet Cart</h2>
                </div>

                {/* Delivery Options */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fulfilment Options</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${deliveryMethod === 'counter' ? 'bg-accent/5 border-accent text-accent' : 'bg-white/5 border-transparent text-gray-300 hover:bg-white/10'}`}>
                      <input 
                        type="radio" 
                        name="del_method" 
                        className="w-4 h-4 text-accent border-white/20 focus:ring-accent"
                        checked={deliveryMethod === 'counter'}
                        onChange={() => setDeliveryMethod('counter')}
                      />
                      <div className="ml-3 flex items-center gap-2">
                        <ChefHat className="w-4 h-4" />
                        <span className="text-xs font-bold text-white">VIP Counter Pickup</span>
                      </div>
                    </label>

                    <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${deliveryMethod === 'seat' ? 'bg-accent/5 border-accent text-accent' : 'bg-white/5 border-transparent text-gray-300 hover:bg-white/10'}`}>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="del_method" 
                          className="w-4 h-4 text-accent border-white/20 focus:ring-accent"
                          checked={deliveryMethod === 'seat'}
                          onChange={() => setDeliveryMethod('seat')}
                        />
                        <div className="ml-3 flex items-center gap-2">
                          <Armchair className="w-4 h-4" />
                          <span className="text-xs font-bold text-white">Deliver to Seat</span>
                        </div>
                      </div>

                      {deliveryMethod === 'seat' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pl-7 mt-3 space-y-2"
                        >
                          <input 
                            type="text" 
                            placeholder="Enter Seat Number (e.g. A-12)"
                            value={seatNumber}
                            onChange={(e) => setSeatNumber(e.target.value)}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent text-white"
                          />
                          <p className="text-[10px] text-gray-500">Scan the QR code on your seat armrest to automatically link seat details.</p>
                        </motion.div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Booking ID Input */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Link Ticket Booking ID (Optional)</h3>
                  <input 
                    type="text" 
                    placeholder="Enter Booking ID (e.g. BKG-XYZ)" 
                    value={bookingIdInput}
                    onChange={(e) => setBookingIdInput(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-accent text-white"
                  />
                </div>

                {/* Cart list preview */}
                {cart.length > 0 ? (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="max-h-40 overflow-y-auto hide-scrollbar space-y-2">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-xs bg-white/5 p-2 rounded-xl">
                          <span className="font-bold text-white line-clamp-1">{item.name} ({item.quantity})</span>
                          <span className="font-bold text-primary-light">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-xs pt-2 border-t border-white/5">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>GST (5%)</span>
                        <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold mt-2">
                        <span>Grand Total</span>
                        <span className="text-primary-light">₹{(cartTotal * 1.05).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto stroke-1" />
                    <p className="text-gray-500 text-xs mt-2">Your cart is empty.</p>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0 || isCheckingOut || (deliveryMethod === 'seat' && !seatNumber)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent text-neutral-950 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-glow-accent transition-all duration-300 disabled:opacity-50 uppercase tracking-wider text-xs"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  ) : (
                    <>Order Now (₹{(cartTotal * 1.05).toFixed(2)})</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Scanner View Tab */
          <motion.div
            key="scanner-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 top-16 bg-black flex flex-col z-20"
          >
            {/* Viewfinder scanner content */}
            <div className="flex-1 relative flex flex-col items-center justify-center px-6">
              <h1 className="text-white text-xl font-bold mb-8 text-center drop-shadow-md flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                Scan QR Code on your Armrest
              </h1>
              
              <div className="relative w-64 h-64">
                {/* Viewfinder brackets */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl" />

                {/* Animated scan line */}
                {scanning ? (
                  <motion.div 
                    animate={{ y: [0, 250, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-accent shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                  />
                ) : (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 bg-accent/20 border-2 border-accent rounded-xl flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="bg-accent text-white px-4 py-2 rounded-full font-bold shadow-glow-accent text-sm">
                      Linked to Seat: {scannedSeat}
                    </div>
                  </motion.div>
                )}

                {/* Dummy Camera Feed Background */}
                <div className="absolute inset-4 bg-surface/30 rounded-lg -z-10" />
              </div>

              <p className="text-gray-400 text-sm mt-8 text-center flex items-center gap-2">
                <Camera className="w-4 h-4" /> Align the QR code within the frame
              </p>

              {!scanning && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-12 text-center"
                >
                  <p className="text-primary-light font-bold">Unlocking Snack Menu...</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
