"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, MapPin, Bell, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { LocationModal } from './LocationModal';
import { useLocationStore } from '@/store/locationStore';

export function TopNav() {
  const { user, loading } = useAuthStore();
  const { city, setCity } = useLocationStore();
  const pathname = usePathname();
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);

  // Hide TopNav on checkout or if unauthenticated
  if (pathname.includes('/checkout')) return null;
  if (loading || !user) return null;

  return (
    <>
      <nav className="hidden sm:flex sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/10 h-16 items-center px-6 lg:px-12 justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            BOX<span className="text-accent tracking-widest ml-0.5">OFFICE</span>
          </Link>
          
          <button 
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1.5 bg-surface/50 py-1.5 px-4 rounded-full border border-primary/20 hover:border-primary/50 hover:bg-surface/80 transition-all cursor-pointer group"
          >
            <MapPin className="w-4 h-4 text-accent group-hover:animate-bounce" />
            <span className="text-sm font-semibold text-gray-200">{city}</span>
          </button>
        </div>

        <div className="flex-1 max-w-xl px-8">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder={`Search for movies in ${city}...`}
              className="w-full bg-surface/30 border border-primary/20 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-gray-500 text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Movies</Link>
          <Link href="/scanner" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Snacks & QR</Link>
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <button className="text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full border border-background"></span>
            </button>
            
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className={`p-[2px] rounded-full flex items-center justify-center transition-all ${
                  user.isGoldClassVIP
                    ? "w-8 h-8 bg-gradient-to-tr from-[#d4af37] via-[#c5a880] to-[#f3e5ab] shadow-[0_0_10px_rgba(212,175,55,0.15)]"
                    : "w-8 h-8 bg-gradient-to-tr from-primary to-accent"
                }`}>
                  <div className="w-full h-full bg-surface rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-[#d4af37] to-[#c5a880] hover:from-[#e5c048] hover:to-[#d6b991] text-neutral-950 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setLocationModalOpen(false)} 
        currentCity={city}
        onSelectCity={setCity}
      />
    </>
  );
}
