"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { MOVIES } from '@/data/movies';
import { useLocationStore } from '@/store/locationStore';

export default function MoviesPage() {
  const [activeTab, setActiveTab] = useState<'now' | 'soon'>('now');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const { city } = useLocationStore();

  React.useEffect(() => {
    setSelectedLanguage('All');
  }, [city]);

  const availableLanguages = ['All', ...Array.from(new Set(
    MOVIES.filter(m => m.locations.includes(city)).map(m => m.language)
  ))];

  const nowPlaying = MOVIES.filter(m => !('comingSoon' in m && m.comingSoon) && m.locations.includes(city) && (selectedLanguage === 'All' || m.language === selectedLanguage));
  const comingSoon = MOVIES.filter(m => 'comingSoon' in m && m.comingSoon && m.locations.includes(city) && (selectedLanguage === 'All' || m.language === selectedLanguage));

  const displayedMovies = activeTab === 'now' ? nowPlaying : comingSoon;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">Showtimes in {city}</h1>
            <p className="text-gray-400 text-sm mt-2">Explore currently running and highly anticipated upcoming releases in {city}</p>
          </div>
          
          {/* Tab Selector */}
          <div className="flex bg-surface border border-white/5 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('now')}
              className={`px-6 py-2.5 rounded-lg text-sm font-black transition-all duration-300 uppercase tracking-wider ${activeTab === 'now' ? 'bg-gradient-to-r from-primary to-accent text-neutral-950 shadow-glow-accent' : 'text-gray-400 hover:text-white'}`}
            >
              Now Playing ({nowPlaying.length})
            </button>
            <button
              onClick={() => setActiveTab('soon')}
              className={`px-6 py-2.5 rounded-lg text-sm font-black transition-all duration-300 uppercase tracking-wider ${activeTab === 'soon' ? 'bg-gradient-to-r from-primary to-accent text-neutral-950 shadow-glow-accent' : 'text-gray-400 hover:text-white'}`}
            >
              Coming Soon ({comingSoon.length})
            </button>
          </div>
        </div>

        {/* Language Selector Pills */}
        {availableLanguages.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-10 bg-surface/30 p-2 rounded-2xl border border-white/5 w-fit">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 ${
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedMovies.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 font-medium">
              No movies found for the selected category in {city}.
            </div>
          ) : (
            displayedMovies.map(movie => {
              const isSoon = 'comingSoon' in movie && !!movie.comingSoon;
            return (
              <Link 
                href={`/movies/${movie.id}`} 
                key={movie.id} 
                className="group bg-surface/10 hover:bg-surface/30 border border-primary/5 hover:border-accent/30 rounded-2xl p-3 transition-all duration-300 hover:shadow-glow-primary flex flex-col gap-3 relative cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {isSoon ? (
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                      <span className="text-[8px] sm:text-[9px] font-black bg-accent text-neutral-950 px-2 py-1 rounded tracking-wider uppercase shadow-md">
                        Coming Soon
                      </span>
                      <span className="text-[8px] font-black bg-primary/80 backdrop-blur-sm text-white px-2 py-1 rounded shadow-md border border-primary/20 tracking-wider uppercase">
                        {movie.language}
                      </span>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-1 text-accent mb-2">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-white text-xs font-black">{movie.rating}</span>
                    </div>
                    {isSoon ? (
                      <div className="w-full bg-neutral-800 border border-white/10 text-primary-light text-[10px] sm:text-xs font-bold py-2 rounded-lg text-center uppercase tracking-wider">
                        Releasing {movie.releaseDate}
                      </div>
                    ) : (
                      <div className="w-full bg-gradient-to-r from-primary to-accent text-neutral-950 text-xs font-black py-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center uppercase tracking-wider">
                        Book Now
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-1 py-1">
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-accent transition-colors line-clamp-1">{movie.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">{movie.genre} • <span className="text-accent font-bold">{movie.language}</span></p>
                </div>
              </Link>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
