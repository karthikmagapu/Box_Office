"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Settings, CreditCard, Heart, Bell, LogOut, ChevronRight, Crown, Edit2, Check, X, Camera, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { playSuccessChime } from '@/lib/sound';
import { useRouter } from 'next/navigation';

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Garfield",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop"
];

export default function ProfilePage() {
  const { user, updateUser, purchaseVIPUpgrade, loading, logout } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpgradingProfile, setIsUpgradingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  // Redirect if not logged in and loading is complete
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [loading, user, router]);

  // Sync edit form data once user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-medium text-sm animate-pulse">Loading profile...</p>
      </div>
    );
  }

  const handleSave = async () => {
    await updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || ''
    });
    setIsEditing(false);
  };

  const handleUpgradeProfile = async () => {
    setIsUpgradingProfile(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await purchaseVIPUpgrade();
    playSuccessChime();
    setIsUpgradingProfile(false);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className={`pt-8 pb-6 px-6 relative overflow-hidden transition-all duration-500 border-b ${
        user.isGoldClassVIP 
          ? "bg-gradient-to-r from-surface via-surface to-[#1a140d] border-[#d4af37]/30 shadow-[0_4px_30px_rgba(212,175,55,0.08)]" 
          : "bg-surface border-white/5"
      }`}>
        {/* Spotlight effect */}
        {user.isGoldClassVIP ? (
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[80px] -z-10 animate-pulse" />
        ) : (
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
        )}
        
        <div className="max-w-2xl mx-auto">
          {/* Top Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold tracking-wide text-white">Profile</h1>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)} 
                className={`flex items-center gap-1.5 text-sm font-bold transition-all px-3 py-1.5 rounded-lg ${
                  user.isGoldClassVIP
                    ? "text-[#d4af37] hover:bg-[#d4af37]/10"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleCancel} 
                  className="text-sm text-gray-400 hover:text-white transition-colors px-2 py-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className={`flex items-center gap-1 text-neutral-950 px-4 py-1.5 rounded-lg text-sm font-black transition-all shadow-md ${
                    user.isGoldClassVIP
                      ? "bg-gradient-to-r from-[#d4af37] to-[#c5a880] hover:scale-105"
                      : "bg-primary hover:bg-primary-light"
                  }`}
                >
                  <Check className="w-4 h-4" /> Save
                </button>
              </div>
            )}
          </div>

          {/* User Details Details / Editing form */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <div className={`p-[3px] rounded-full transition-all duration-500 ${
                user.isGoldClassVIP
                  ? "w-24 h-24 bg-gradient-to-tr from-[#d4af37] via-[#c5a880] to-[#f3e5ab] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  : "w-24 h-24 bg-gradient-to-tr from-primary to-accent"
              }`}>
                <div className="w-full h-full bg-surface rounded-full overflow-hidden relative">
                  <img 
                    src={isEditing ? (formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop') : (user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop')} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/45 transition-colors">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 w-full text-center sm:text-left">
              {!isEditing ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start mb-1">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">{user.name}</h2>
                    {user.isGoldClassVIP && (
                      <span className="bg-gradient-to-r from-[#d4af37] to-[#c5a880] text-neutral-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-md animate-pulse self-center sm:self-auto w-fit">
                        <Crown className="w-3.5 h-3.5 fill-current" /> Verified VIP
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  {user.phone && <p className="text-gray-400 text-sm mt-0.5">{user.phone}</p>}
                  
                  {user.isGoldClassVIP ? (
                    <div className="flex flex-col gap-2 mt-3 items-center sm:items-start">
                      <div className="flex items-center gap-1.5 text-[#d4af37] text-xs font-bold bg-[#d4af37]/10 px-2.5 py-1 rounded-md w-fit border border-[#d4af37]/20 shadow-[0_0_10px_rgba(212,175,55,0.05)]">
                        <Crown className="w-3.5 h-3.5 fill-current" />
                        GOLD CLASS VIP MEMBER
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#c5a880] font-semibold mt-1">
                        <Check className="w-4 h-4 text-emerald-500" />
                        VIP Perks Active: Free Snacks, Weekend Offers, & more
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 mt-3 items-center sm:items-start">
                      <div className="flex items-center gap-1.5 text-yellow-500 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded-md w-fit border border-yellow-500/20">
                        <Crown className="w-3 h-3" />
                        GOLD MEMBER
                      </div>
                      <button 
                        onClick={handleUpgradeProfile}
                        disabled={isUpgradingProfile}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#c5a880] hover:from-[#e5c048] hover:to-[#d6b991] text-neutral-950 px-5 py-2 rounded-xl text-xs font-black transition-all shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-1"
                      >
                        {isUpgradingProfile ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                            Upgrading...
                          </>
                        ) : (
                          <>
                            <Crown className="w-3.5 h-3.5 fill-current animate-bounce" />
                            Upgrade to Gold Class VIP (₹150)
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3 w-full max-w-sm mt-3 sm:mt-0">
                  <div>
                    <label className="text-xs text-gray-400 font-medium ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 mt-1 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-medium ml-1">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 mt-1 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-medium ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 "
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 mt-1 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-medium ml-1">Profile Photo URL</label>
                    <input 
                      type="text" 
                      value={formData.avatar}
                      onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 mt-1 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-1">Or Select a Preset Avatar</label>
                    <div className="grid grid-cols-5 gap-2 mt-1.5 bg-black/30 p-2 rounded-xl border border-white/5">
                      {AVATAR_PRESETS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({...formData, avatar: url})}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all p-[1px] ${
                            formData.avatar === url 
                              ? "border-[#d4af37] scale-110 shadow-[0_0_8px_rgba(212,175,55,0.35)]" 
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full rounded-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Loyalty Card */}
        <div className={`p-6 rounded-2xl mb-8 relative overflow-hidden transition-all duration-500 shadow-lg ${
          user.isGoldClassVIP 
            ? 'bg-gradient-to-r from-[#d4af37]/90 via-[#c5a880]/90 to-[#b58c54]/90 border border-[#d4af37]/30 shadow-[0_4px_25px_rgba(212,175,55,0.15)] text-neutral-950'
            : 'bg-gradient-to-r from-primary/80 to-primary-light/80 text-white shadow-glow-primary'
        }`}>
          <div className="absolute -right-10 -bottom-10 opacity-20">
            <Crown className="w-48 h-48" />
          </div>
          <p className={`font-medium text-sm mb-1 ${user.isGoldClassVIP ? 'text-neutral-950/80' : 'text-white/80'}`}>Available Points</p>
          <p className="text-4xl font-black">{user.loyaltyPoints.toLocaleString()}</p>
          <p className={`text-xs mt-4 ${user.isGoldClassVIP ? 'text-neutral-950/60 font-semibold' : 'text-white/60'}`}>
            {user.isGoldClassVIP ? "You are a VIP Member. Enjoy 2x loyalty rewards on all bookings!" : "Earn 50 more points to reach Platinum Tier"}
          </p>
        </div>

        {/* Menu Items */}
        <div className="bg-surface/50 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          <Link href="/tickets" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-primary-light">
                <Heart className="w-4 h-4" />
              </div>
              <span className="font-medium">Saved Theatres & Movies</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </Link>
          
          <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-blue-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-medium">Payment Methods</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-yellow-400">
                <Bell className="w-4 h-4" />
              </div>
              <span className="font-medium">Notifications</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>
          
          <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-gray-400">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-medium">Account Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>

        <button 
          onClick={() => logout()}
          className="mt-8 w-full py-4 rounded-xl border border-red-500/20 text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>

      </div>
    </div>
  );
}
