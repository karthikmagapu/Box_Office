"use client";

import React from 'react';
import { Play, Star, Clock, CalendarDays, Share2, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { MOVIES } from '@/data/movies';

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);

  // Find the movie by ID or fallback
  const movieData = MOVIES.find(m => m.id === unwrappedParams.id) || MOVIES[0];

  const isComingSoon = 'comingSoon' in movieData && !!(movieData as { comingSoon?: boolean }).comingSoon;

  const movie = {
    ...movieData,
    synopsis: isComingSoon
      ? `The highly anticipated Tollywood action blockbuster starring ${movieData.cast?.map(c => c.name).join(', ') || 'an ensemble cast'}. Get ready for a monumental cinematic experience featuring high-octane action sequences, gripping drama, and stellar performances.`
      : 'A thrilling cinematic experience filled with action, emotion, and spectacular visuals. Prepare to be blown away by the gripping narrative and stunning performances.',
    votes: isComingSoon ? 'Anticipated' : '124k',
    releaseDate: 'releaseDate' in movieData && typeof (movieData as { releaseDate?: string }).releaseDate === 'string' 
      ? (movieData as { releaseDate: string }).releaseDate 
      : 'Mar 1, 2026',
    cast: movieData.cast || []
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Header */}
      <div className="relative h-[50vh] sm:h-[60vh] w-full">
        <div className="absolute inset-0">
          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <a 
            href={movie.trailerUrl}
            target="_blank"
            rel="noreferrer"
            className="w-16 h-16 rounded-full bg-accent/20 backdrop-blur-md border border-accent/40 flex items-center justify-center hover:scale-110 hover:bg-accent/30 transition-transform shadow-glow-accent"
          >
            <Play className="w-6 h-6 text-accent fill-current ml-1" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-32">
        <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
          <div className="w-32 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20 flex-shrink-0">
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight text-white">{movie.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-300 font-medium mb-4">
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white text-base font-bold">{movie.rating}/10</span>
                <span className="text-gray-500 text-xs font-semibold">({movie.votes})</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" /> {movie.duration}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-surface/50 border border-primary/20 rounded-md text-xs font-semibold text-primary-light">{movie.genre}</span>
              <span className="px-3 py-1 bg-surface/50 border border-primary/20 rounded-md text-xs font-semibold text-accent/80">U/A 13+</span>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none h-12 w-12 bg-surface/50 border border-primary/20 rounded-xl flex items-center justify-center hover:bg-surface/80 hover:border-accent/40 text-gray-300 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Available Formats */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-white uppercase tracking-wider text-sm">Available Formats</h3>
          <div className="flex flex-wrap gap-3">
            {movie.formats.map(f => (
              <span key={f} className="px-4 py-2 border border-primary/25 bg-surface/40 rounded-lg text-sm font-bold tracking-wider text-accent">{f}</span>
            ))}
          </div>
        </div>

        {/* Synopsis */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-white uppercase tracking-wider text-sm">About the Movie</h3>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            {movie.synopsis}
          </p>
        </div>

        {/* Cast */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-wider text-sm">Cast</h3>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
            {movie.cast.map(person => (
              <div key={person.name} className="flex flex-col items-center gap-2 w-20 flex-shrink-0 group">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-primary/20 group-hover:border-accent/60 p-0.5 transition-colors bg-surface">
                  <img src={person.img} alt={person.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold leading-tight text-gray-200 group-hover:text-accent transition-colors">{person.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Book Ticket Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-surface/95 backdrop-blur-2xl border-t border-primary/10 z-50">
        <div className="max-w-4xl mx-auto">
          {isComingSoon ? (
            <div className="flex gap-4">
              <a 
                href={movie.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white/10 hover:bg-white/25 border border-white/10 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider text-center"
              >
                <Play className="w-4 h-4 text-accent fill-current" /> Watch Trailer
              </a>
              <button 
                disabled
                className="flex-1 bg-neutral-800 text-gray-500 border border-white/5 py-4 rounded-xl font-black cursor-not-allowed uppercase tracking-wider"
              >
                Releasing {movie.releaseDate}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => router.push(`/book/${movie.id}/theatres`)}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent text-neutral-950 py-4 rounded-xl font-black shadow-glow-accent hover:scale-[1.01] transition-all duration-300 text-lg uppercase tracking-wider"
            >
              Book Tickets
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
