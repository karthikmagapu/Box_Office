"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Star, Clock, ChevronRight, ChevronLeft, Sparkles, Crown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOVIES } from '@/data/movies';
import { useAuthStore } from '@/store/authStore';
import { playSuccessChime } from '@/lib/sound';
import { LoginForm } from '@/components/LoginForm';
import { useLocationStore } from '@/store/locationStore';

export default function HomePage() {
  const { user, purchaseVIPUpgrade, loading } = useAuthStore();
  const { city } = useLocationStore();
  const [isUpgradingHome, setIsUpgradingHome] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const handleUpgradeHome = async () => {
    setIsUpgradingHome(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await purchaseVIPUpgrade();
    playSuccessChime();
    setIsUpgradingHome(false);
    setUpgradeSuccess(true);
    setTimeout(() => setUpgradeSuccess(false), 3000);
  };

  const featuredMovies = MOVIES.filter(m => m.featured && m.locations.includes(city));
  const displayFeaturedMovies = featuredMovies.length > 0 ? featuredMovies : MOVIES.filter(m => m.featured);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [showSplash, setShowSplash] = useState(true);

  // Reset carousel slide and language filter when city changes
  useEffect(() => {
    setCurrentSlide(0);
    setSelectedLanguage('All');
  }, [city]);

  // Auto-advance carousel
  useEffect(() => {
    if (displayFeaturedMovies.length <= 1) {
      setCurrentSlide(0);
      return;
    }
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayFeaturedMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayFeaturedMovies.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const hero = displayFeaturedMovies[currentSlide] || displayFeaturedMovies[0];
  
  const availableLanguages = ['All', ...Array.from(new Set(
    MOVIES.filter(m => m.locations.includes(city)).map(m => m.language)
  ))];

  const nowPlaying = MOVIES.filter(m => 
    !m.featured && 
    !('comingSoon' in m && m.comingSoon) && 
    m.locations.includes(city) &&
    (selectedLanguage === 'All' || m.language === selectedLanguage)
  );

  const comingSoon = MOVIES.filter(m => 
    'comingSoon' in m && 
    m.comingSoon && 
    m.locations.includes(city) &&
    (selectedLanguage === 'All' || m.language === selectedLanguage)
  );

  const letterVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.08,
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number]
      }
    })
  };

  const lineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "140px",
      opacity: 1,
      transition: {
        delay: 0.9,
        duration: 0.7,
        ease: "easeInOut" as const
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, letterSpacing: "0.15em" },
    visible: {
      opacity: 0.6,
      letterSpacing: "0.3em",
      transition: {
        delay: 1.1,
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const splashContainerVariants = {
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
        when: "afterChildren"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          variants={splashContainerVariants}
          exit="exit"
          className="fixed inset-0 z-50 bg-[#08080c] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Spotlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute w-[400px] h-[400px] bg-accent/30 rounded-full blur-[100px] pointer-events-none"
          />

          <div className="relative flex flex-col items-center select-none">
            {/* Logo Text Animation */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider flex items-center justify-center font-sans">
              {"BOX".split("").map((char, index) => (
                <motion.span
                  key={`box-${index}`}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={letterVariants}
                  className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                >
                  {char}
                </motion.span>
              ))}
              {"OFFICE".split("").map((char, index) => (
                <motion.span
                  key={`office-${index}`}
                  custom={index + 3}
                  initial="hidden"
                  animate="visible"
                  variants={letterVariants}
                  className="text-accent drop-shadow-[0_0_35px_rgba(197,168,128,0.25)]"
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            {/* Glowing Golden Horizontal Line */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={lineVariants}
              className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent my-4"
            />

            {/* Premium Cinema Subtext */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={subtitleVariants}
              className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400 text-center"
            >
              PREMIUM CINEMAS
            </motion.p>
          </div>
        </motion.div>
      ) : loading ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium text-sm animate-pulse">Entering Lounge...</p>
        </div>
      ) : !user ? (
        <motion.div
          key="login-content"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="min-h-screen bg-[#08080c] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none"
        >
          {/* Spotlight background */}
          <div className="absolute w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[100px] -top-1/4 -z-10 pointer-events-none" />
          <LoginForm defaultRedirect="/" />
        </motion.div>
      ) : (
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col min-h-screen bg-background"
        >
          {/* Dynamic Hero Carousel Section */}
          <section className="relative w-full h-[65vh] sm:h-[80vh] md:h-[90vh] overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div 
                key={hero.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <img src={hero.poster} alt={hero.title} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Ambient Glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 lg:px-24 pb-16 sm:pb-24 max-w-7xl mx-auto z-10">
              <motion.div
                key={`content-${hero.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="flex gap-2 mb-4">
                  {hero.formats.map(format => (
                    <span key={format} className="px-2.5 py-1 text-[9px] font-black tracking-widest uppercase border border-accent/30 bg-accent/10 backdrop-blur-md rounded-md text-accent shadow-glass">
                      {format}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4 drop-shadow-xl text-white">
                  {hero.title.split(':').map((part, index) => (
                    <span key={index} className={index === 1 ? "block text-2xl sm:text-3xl md:text-4xl font-semibold mt-2 text-primary-light" : ""}>
                      {part}
                    </span>
                  ))}
                </h1>

                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-300 mb-8 font-semibold">
                  <span className="text-accent">{hero.genre}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-white font-black">{hero.rating}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="flex items-center gap-1 text-gray-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{hero.duration}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link 
                    href={`/book/${hero.id}/theatres`}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent text-neutral-950 px-8 py-3.5 sm:py-4 rounded-xl font-black text-sm sm:text-base flex items-center justify-center shadow-glow-accent transition-all duration-300 w-full sm:w-auto hover:scale-105 uppercase tracking-wider"
                  >
                    Book Tickets
                  </Link>
                  <a 
                    href={hero.trailerUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-surface/30 hover:bg-surface/60 backdrop-blur-md border border-primary/20 hover:border-primary/50 text-white px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-300 w-full sm:w-auto gap-2 hover:scale-105"
                  >
                    <Play className="w-4 h-4 text-accent fill-current" /> Watch Trailer
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-24 flex gap-2 z-10 bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/5">
              {featuredMovies.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-accent shadow-glow-accent' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </section>

          {/* Luxury Cinematic Sliders Section */}
          <section className="px-6 sm:px-12 lg:px-24 py-16 max-w-7xl mx-auto w-full space-y-16">
            
            {/* Recommended list */}
            <div>
              <div className="flex justify-between items-end mb-8 border-l-4 border-accent pl-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">Trending in {city}</h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Blockbusters drawing the biggest crowds in {city} today</p>
                </div>
                <Link href="/movies" className="text-accent text-xs sm:text-sm font-semibold hover:underline flex items-center gap-1 group">
                  Explore All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Language Selector Pills */}
              {availableLanguages.length > 2 && (
                <div className="flex flex-wrap gap-2 mb-8 bg-surface/10 p-2 rounded-2xl border border-white/5 w-fit">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                        selectedLanguage === lang
                          ? 'bg-gradient-to-r from-primary to-accent text-neutral-950 shadow-glow-accent'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {nowPlaying.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-gray-500 text-sm">
                    No movies currently playing in {city}.
                  </div>
                ) : (
                  nowPlaying.map(movie => (
                    <Link 
                      href={`/movies/${movie.id}`} 
                      key={movie.id} 
                      className="group bg-surface/20 hover:bg-surface/40 border border-primary/10 hover:border-accent/40 rounded-2xl p-2.5 transition-all duration-300 hover:shadow-glow-primary flex flex-col gap-3 relative cursor-pointer"
                    >
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                        
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {movie.formats.slice(0, 2).map(f => (
                            <span key={f} className="text-[8px] font-bold bg-black/60 backdrop-blur-sm border border-accent/20 px-1.5 py-0.5 rounded text-accent tracking-wider uppercase">{f}</span>
                          ))}
                        </div>

                        <div className="absolute top-2 left-2">
                          <span className="text-[8px] font-black bg-primary/80 backdrop-blur-sm text-white px-2 py-1 rounded shadow-md border border-primary/20 tracking-wider uppercase">
                            {movie.language}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center gap-1 text-accent mb-2">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-white text-xs font-black">{movie.rating}</span>
                          </div>
                          <div className="w-full bg-gradient-to-r from-primary to-accent text-neutral-950 text-xs font-black py-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center uppercase tracking-wider">
                            Book Now
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-1 py-1">
                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-accent transition-colors line-clamp-1">{movie.title}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">{movie.genre}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Coming Soon / Tollywood Spotlight list */}
            <div>
              <div className="flex justify-between items-end mb-8 border-l-4 border-accent pl-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">Tollywood Coming Soon</h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Most anticipated upcoming Telugu blockbusters</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {comingSoon.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-gray-500 text-sm">
                    No upcoming movies scheduled for {city}.
                  </div>
                ) : (
                  comingSoon.map(movie => (
                    <Link 
                      href={`/movies/${movie.id}`} 
                      key={movie.id} 
                      className="group bg-surface/20 hover:bg-surface/40 border border-primary/10 hover:border-accent/40 rounded-2xl p-3 transition-all duration-300 hover:shadow-glow-accent flex flex-col gap-3 relative cursor-pointer"
                    >
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                        
                        <div className="absolute top-2 left-2">
                          <span className="text-[8px] sm:text-[9px] font-black bg-accent text-neutral-950 px-2 py-1 rounded tracking-wider uppercase shadow-md">
                            Coming Soon
                          </span>
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1.5">
                          <div className="flex items-center gap-1 text-accent">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-white text-xs font-black">{movie.rating}</span>
                          </div>
                          <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 rounded text-center text-[10px] sm:text-xs text-primary-light font-bold">
                            Releasing {movie.releaseDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-1">
                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-accent transition-colors line-clamp-1">{movie.title}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{movie.genre} • <span className="text-accent font-bold">{movie.language}</span></p>
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">Cast: {movie.cast?.map(c => c.name).join(', ')}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* VIP Gold Class Upgrades & Plans Showcase */}
            <div className="space-y-10 pt-8">
              <div className="border-l-4 border-accent pl-4">
                <span className="bg-accent/15 border border-accent/30 text-accent text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
                  Gold Class VIP Experience
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-2">VIP Upgrades, Plans & Offers</h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Upgrade your tickets to experience ultimate luxury and unlock exclusive movie offers</p>
              </div>

              {/* Plans Comparison & Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Standard Plan Card */}
                <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Plan 01</span>
                    <h3 className="text-lg font-bold text-white uppercase">Standard Booking</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Enjoy premium cinema screens with standard seating layouts and general lobby snack counter collection.
                    </p>
                    <div className="h-px bg-white/5 my-2" />
                    <ul className="space-y-2 text-xs text-gray-400">
                      <li className="flex items-center gap-2">✓ Ergonomic Seats</li>
                      <li className="flex items-center gap-2">✓ 4K Laser Projection</li>
                      <li className="flex items-center gap-2">✓ Lobby Food Counter</li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500 font-medium">Pricing</p>
                    <p className="text-xl font-black text-white">Base Ticket Price</p>
                  </div>
                </div>

                {/* Gold Class Upgrade Card (Highlighted) */}
                <div className="bg-gradient-to-b from-surface/80 to-accent/5 border-2 border-accent rounded-3xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-glow-accent">
                  <div className="absolute top-0 right-0 bg-accent text-neutral-950 font-black text-[8px] uppercase tracking-wider px-3 py-1.5 rounded-bl-xl shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" /> Recommended
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Plan 02</span>
                    <h3 className="text-lg font-bold text-white uppercase flex items-center gap-1.5">
                      Gold Class VIP Upgrade
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Transform your movie experience with unmatched luxury, in-seat gourmet dining service, and free refreshments!
                    </p>
                    <div className="h-px border-t border-accent/20 my-2" />
                    <ul className="space-y-2 text-xs text-gray-200">
                      <li className="flex items-center gap-2 text-accent font-bold">★ FREE Chilled Coke (Large)</li>
                      <li className="flex items-center gap-2">✓ Ultra-plush Reclining Seats</li>
                      <li className="flex items-center gap-2">✓ In-seat Service (Armrest QR)</li>
                      <li className="flex items-center gap-2">✓ Priority VIP Lounge Entry</li>
                      <li className="flex items-center gap-2">✓ Dolby Atmos Spatial Sound</li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-accent/10 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Pricing</p>
                      <p className="text-base font-black text-accent">+ ₹150 <span className="text-[10px] text-gray-400 font-normal">/ tkt</span></p>
                    </div>
                    {user?.isGoldClassVIP ? (
                      <span className="bg-accent text-neutral-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 fill-current" /> Active VIP
                      </span>
                    ) : (
                      <button
                        onClick={handleUpgradeHome}
                        disabled={isUpgradingHome}
                        className="bg-accent hover:bg-white text-neutral-950 hover:text-accent border border-accent hover:border-white px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer flex items-center gap-1"
                      >
                        {isUpgradingHome ? (
                          <div className="w-3.5 h-3.5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                        ) : upgradeSuccess ? (
                          <>Success <Check className="w-3.5 h-3.5" /></>
                        ) : (
                          <>Buy Plan</>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* active offers card */}
                <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Plan 03</span>
                    <h3 className="text-lg font-bold text-white uppercase">Offers & Discounts</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Unlock exclusive savings by applying promo codes at checkout for weekend shows and group bookings.
                    </p>
                    <div className="h-px bg-white/5 my-2" />
                    <div className="space-y-3 text-xs">
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="font-mono font-bold text-white">WEEKEND50</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">Flat ₹50 off per ticket on Saturday & Sunday shows.</p>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="font-mono font-bold text-white">DISCOUNT10</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">10% discount on total ticket value for group outings.</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500 font-medium">Checkout Benefit</p>
                    <p className="text-xl font-black text-primary-light">Save Up to 20%</p>
                  </div>
                </div>

              </div>

              {/* VIP Spotlights Banner */}
              <div className="bg-gradient-to-r from-surface/80 via-surface/40 to-surface/80 border border-primary/20 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <h3 className="text-xl font-bold text-white uppercase">Ready to elevate your experience?</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    Simply pick any movie, choose your seats, and toggle the **Gold Class VIP Upgrade** at the checkout screen. A complimentary large Coke will automatically be added to your order!
                  </p>
                </div>
                <Link 
                  href="/scanner" 
                  className="bg-transparent border border-accent hover:bg-accent hover:text-neutral-950 text-accent px-8 py-3.5 rounded-xl font-bold text-xs transition-all duration-300 whitespace-nowrap uppercase tracking-wider animate-pulse hover:animate-none"
                >
                  Explore Snacks & Scanner
                </Link>
              </div>
            </div>

          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
