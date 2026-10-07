"use client";

import React, { useState } from 'react';
import { QrCode, Clock, MapPin, Film, ChevronRight } from 'lucide-react';

const DUMMY_TICKETS = [
  {
    id: 'BKG-XYZ987',
    movie: 'DUNE: PART TWO',
    theatre: 'PVR Director\'s Cut, Vasant Kunj',
    date: 'Today',
    time: '09:30 PM',
    seats: ['A-12', 'A-13'],
    status: 'upcoming',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'BKG-ABC123',
    movie: 'Oppenheimer',
    theatre: 'IMAX, Select Citywalk',
    date: '12 Oct 2026',
    time: '06:00 PM',
    seats: ['G-10', 'G-11'],
    status: 'past',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=200&auto=format&fit=crop'
  }
];

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const tickets = DUMMY_TICKETS.filter(t => t.status === activeTab);

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-surface border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <h1 className="text-2xl font-bold">My Tickets</h1>
        </div>
        <div className="flex px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/5">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 text-sm font-semibold relative ${activeTab === 'upcoming' ? 'text-primary-light' : 'text-gray-400'}`}
          >
            Upcoming
            {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-light" />}
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 text-sm font-semibold relative ${activeTab === 'past' ? 'text-primary-light' : 'text-gray-400'}`}
          >
            Past
            {activeTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-light" />}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {tickets.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Film className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No {activeTab} tickets found.</p>
          </div>
        )}
        
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-surface/50 border border-white/10 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:border-white/20 transition-colors cursor-pointer group">
            <div className="w-full sm:w-32 h-40 sm:h-auto bg-white/5 flex-shrink-0 relative">
              <img src={ticket.poster} alt={ticket.movie} className="w-full h-full object-cover" />
              {ticket.status === 'past' && <div className="absolute inset-0 bg-black/50 grayscale" />}
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-primary-light transition-colors">{ticket.movie}</h3>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300 font-mono">{ticket.id}</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="line-clamp-1">{ticket.theatre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{ticket.date} • {ticket.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500">Seats:</span>
                  <span className="text-xs font-bold text-white">{ticket.seats.join(', ')}</span>
                </div>
                {ticket.status === 'upcoming' && (
                  <button className="flex items-center gap-1 text-primary-light text-sm font-semibold hover:underline">
                    <QrCode className="w-4 h-4" /> View Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
