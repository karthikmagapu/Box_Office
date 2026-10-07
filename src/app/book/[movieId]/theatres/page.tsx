"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Info, Calendar as CalendarIcon, Filter, Search, ChevronRight, Check } from 'lucide-react';
import { MOVIES } from '@/data/movies';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';

import { useLocationStore } from '@/store/locationStore';

// Dynamic City Theatres Data
const CITY_THEATRES: { [key: string]: Array<{ id: string; name: string; location: string; distance: string; formats: string[]; timings: Array<{ time: string; type: string; price: number; fillingFast: boolean }> }> } = {
  'Mumbai': [
    {
      id: 'mum1',
      name: "PVR: Phoenix Palladium",
      location: "Lower Parel, Mumbai",
      distance: "2.5 km",
      formats: ["IMAX 3D", "4DX", "2D"],
      timings: [
        { time: "09:30 AM", type: "IMAX 3D", price: 480, fillingFast: false },
        { time: "01:15 PM", type: "4DX", price: 580, fillingFast: true },
        { time: "06:45 PM", type: "IMAX 3D", price: 680, fillingFast: true },
        { time: "10:30 PM", type: "2D", price: 380, fillingFast: false },
      ]
    },
    {
      id: 'mum2',
      name: "INOX: Insignia Atria Mall",
      location: "Worli, Mumbai",
      distance: "4.1 km",
      formats: ["3D", "2D"],
      timings: [
        { time: "10:00 AM", type: "2D", price: 350, fillingFast: false },
        { time: "02:30 PM", type: "3D", price: 450, fillingFast: false },
        { time: "07:00 PM", type: "3D", price: 550, fillingFast: true },
        { time: "11:15 PM", type: "2D", price: 350, fillingFast: false },
      ]
    },
    {
      id: 'mum3',
      name: "Cinepolis: Fun Republic",
      location: "Andheri West, Mumbai",
      distance: "6.8 km",
      formats: ["IMAX", "2D"],
      timings: [
        { time: "11:00 AM", type: "IMAX", price: 520, fillingFast: false },
        { time: "04:45 PM", type: "2D", price: 380, fillingFast: true },
        { time: "08:30 PM", type: "IMAX", price: 620, fillingFast: true },
      ]
    }
  ],
  'Hyderabad': [
    {
      id: 'hyd1',
      name: "Prasads Multiplex (Large Screen)",
      location: "Khairatabad, Hyderabad",
      distance: "1.8 km",
      formats: ["IMAX 3D", "4DX", "2D"],
      timings: [
        { time: "08:45 AM", type: "IMAX 3D", price: 350, fillingFast: true },
        { time: "12:15 PM", type: "4DX", price: 450, fillingFast: true },
        { time: "05:00 PM", type: "IMAX 3D", price: 500, fillingFast: true },
        { time: "09:30 PM", type: "2D", price: 250, fillingFast: false },
      ]
    },
    {
      id: 'hyd2',
      name: "PVR: AMB Cinemall",
      location: "Gachibowli, Hyderabad",
      distance: "8.2 km",
      formats: ["3D", "2D"],
      timings: [
        { time: "10:15 AM", type: "2D", price: 290, fillingFast: false },
        { time: "02:00 PM", type: "3D", price: 350, fillingFast: false },
        { time: "06:30 PM", type: "3D", price: 400, fillingFast: true },
        { time: "10:45 PM", type: "2D", price: 290, fillingFast: false },
      ]
    },
    {
      id: 'hyd3',
      name: "Asian GPR Multiplex",
      location: "Kukatpally, Hyderabad",
      distance: "11.4 km",
      formats: ["IMAX", "2D"],
      timings: [
        { time: "11:30 AM", type: "IMAX", price: 320, fillingFast: false },
        { time: "04:15 PM", type: "2D", price: 220, fillingFast: true },
        { time: "08:00 PM", type: "IMAX", price: 400, fillingFast: true },
      ]
    }
  ],
  'Bengaluru': [
    {
      id: 'blr1',
      name: "PVR: Superplex Forum Mall",
      location: "Koramangala, Bengaluru",
      distance: "3.0 km",
      formats: ["IMAX 3D", "4DX", "2D"],
      timings: [
        { time: "09:00 AM", type: "IMAX 3D", price: 450, fillingFast: false },
        { time: "01:00 PM", type: "4DX", price: 550, fillingFast: true },
        { time: "06:30 PM", type: "IMAX 3D", price: 650, fillingFast: true },
        { time: "10:15 PM", type: "2D", price: 350, fillingFast: false },
      ]
    },
    {
      id: 'blr2',
      name: "Urashi Cinema (Dolby Atmos)",
      location: "Lalbagh Road, Bengaluru",
      distance: "4.5 km",
      formats: ["2D"],
      timings: [
        { time: "10:30 AM", type: "2D", price: 250, fillingFast: false },
        { time: "02:15 PM", type: "2D", price: 250, fillingFast: false },
        { time: "07:15 PM", type: "2D", price: 350, fillingFast: true },
        { time: "10:45 PM", type: "2D", price: 250, fillingFast: false },
      ]
    },
    {
      id: 'blr3',
      name: "Cinepolis: Nexus Shantiniketan",
      location: "Whitefield, Bengaluru",
      distance: "14.2 km",
      formats: ["IMAX", "2D"],
      timings: [
        { time: "11:15 AM", type: "IMAX", price: 500, fillingFast: false },
        { time: "04:30 PM", type: "2D", price: 350, fillingFast: true },
        { time: "08:15 PM", type: "IMAX", price: 600, fillingFast: true },
      ]
    }
  ],
  'Delhi-NCR': [
    {
      id: 'del1',
      name: "PVR Director's Cut",
      location: "Ambience Mall, Vasant Kunj",
      distance: "3.2 km",
      formats: ["IMAX 3D", "4DX", "2D"],
      timings: [
        { time: "09:30 AM", type: "IMAX 3D", price: 450, fillingFast: false },
        { time: "01:15 PM", type: "4DX", price: 550, fillingFast: true },
        { time: "06:45 PM", type: "IMAX 3D", price: 650, fillingFast: true },
        { time: "10:30 PM", type: "2D", price: 350, fillingFast: false },
      ]
    },
    {
      id: 'del2',
      name: "INOX: Insignia",
      location: "Epicuria, Nehru Place",
      distance: "5.5 km",
      formats: ["3D", "2D"],
      timings: [
        { time: "10:00 AM", type: "2D", price: 300, fillingFast: false },
        { time: "02:30 PM", type: "3D", price: 400, fillingFast: false },
        { time: "07:00 PM", type: "3D", price: 500, fillingFast: true },
        { time: "11:15 PM", type: "2D", price: 300, fillingFast: false },
      ]
    },
    {
      id: 'del3',
      name: "Cinepolis: VIP",
      location: "DLF Avenue, Saket",
      distance: "7.1 km",
      formats: ["IMAX", "2D"],
      timings: [
        { time: "11:00 AM", type: "IMAX", price: 500, fillingFast: false },
        { time: "04:45 PM", type: "2D", price: 350, fillingFast: true },
        { time: "08:30 PM", type: "IMAX", price: 600, fillingFast: true },
      ]
    }
  ],
  'Chennai': [
    {
      id: 'chn1',
      name: "Sathyam Cinemas (SPI Group)",
      location: "Royapettah, Chennai",
      distance: "1.2 km",
      formats: ["IMAX 3D", "2D"],
      timings: [
        { time: "09:00 AM", type: "IMAX 3D", price: 290, fillingFast: false },
        { time: "01:30 PM", type: "2D", price: 190, fillingFast: true },
        { time: "06:15 PM", type: "IMAX 3D", price: 350, fillingFast: true },
        { time: "10:00 PM", type: "2D", price: 190, fillingFast: false },
      ]
    },
    {
      id: 'chn2',
      name: "PVR: VR Chennai",
      location: "Anna Nagar, Chennai",
      distance: "5.7 km",
      formats: ["4DX", "2D"],
      timings: [
        { time: "10:15 AM", type: "2D", price: 190, fillingFast: false },
        { time: "02:45 PM", type: "4DX", price: 400, fillingFast: false },
        { time: "07:30 PM", type: "4DX", price: 400, fillingFast: true },
        { time: "11:00 PM", type: "2D", price: 190, fillingFast: false },
      ]
    },
    {
      id: 'chn3',
      name: "Palazzo IMAX",
      location: "Forum Vijaya Mall, Vadapalani",
      distance: "8.0 km",
      formats: ["IMAX", "2D"],
      timings: [
        { time: "11:00 AM", type: "IMAX", price: 350, fillingFast: false },
        { time: "04:45 PM", type: "2D", price: 195, fillingFast: true },
        { time: "08:30 PM", type: "IMAX", price: 400, fillingFast: true },
      ]
    }
  ],
  'Pune': [
    {
      id: 'pun1',
      name: "PVR: Phoenix Marketcity",
      location: "Viman Nagar, Pune",
      distance: "3.5 km",
      formats: ["IMAX 3D", "4DX", "2D"],
      timings: [
        { time: "09:30 AM", type: "IMAX 3D", price: 420, fillingFast: false },
        { time: "01:15 PM", type: "4DX", price: 500, fillingFast: true },
        { time: "06:45 PM", type: "IMAX 3D", price: 600, fillingFast: true },
        { time: "10:30 PM", type: "2D", price: 300, fillingFast: false },
      ]
    },
    {
      id: 'pun2',
      name: "INOX: Elpro City Square",
      location: "Chinchwad, Pune",
      distance: "16.1 km",
      formats: ["3D", "2D"],
      timings: [
        { time: "10:00 AM", type: "2D", price: 250, fillingFast: false },
        { time: "02:30 PM", type: "3D", price: 350, fillingFast: false },
        { time: "07:00 PM", type: "3D", price: 450, fillingFast: true },
        { time: "11:15 PM", type: "2D", price: 250, fillingFast: false },
      ]
    }
  ],
  'Kolkata': [
    {
      id: 'kol1',
      name: "INOX: South City Mall",
      location: "Tollygunge, Kolkata",
      distance: "4.8 km",
      formats: ["IMAX 3D", "2D"],
      timings: [
        { time: "09:30 AM", type: "IMAX 3D", price: 450, fillingFast: false },
        { time: "01:15 PM", type: "2D", price: 250, fillingFast: true },
        { time: "06:45 PM", type: "IMAX 3D", price: 600, fillingFast: true },
        { time: "10:30 PM", type: "2D", price: 250, fillingFast: false },
      ]
    },
    {
      id: 'kol2',
      name: "PVR: Mani Square",
      location: "Kankurgachi, Kolkata",
      distance: "7.2 km",
      formats: ["4DX", "2D"],
      timings: [
        { time: "10:00 AM", type: "2D", price: 200, fillingFast: false },
        { time: "02:30 PM", type: "4DX", price: 450, fillingFast: false },
        { time: "07:00 PM", type: "4DX", price: 500, fillingFast: true },
        { time: "11:15 PM", type: "2D", price: 200, fillingFast: false },
      ]
    }
  ],
  'Kochi': [
    {
      id: 'koc1',
      name: "PVR: Lulu Mall",
      location: "Edappally, Kochi",
      distance: "2.1 km",
      formats: ["IMAX 3D", "4DX", "2D"],
      timings: [
        { time: "09:30 AM", type: "IMAX 3D", price: 400, fillingFast: false },
        { time: "01:15 PM", type: "4DX", price: 480, fillingFast: true },
        { time: "06:45 PM", type: "IMAX 3D", price: 550, fillingFast: true },
        { time: "10:30 PM", type: "2D", price: 250, fillingFast: false },
      ]
    },
    {
      id: 'koc2',
      name: "Shenoys Cinema (Dolby Atmos)",
      location: "MG Road, Kochi",
      distance: "4.9 km",
      formats: ["2D"],
      timings: [
        { time: "10:00 AM", type: "2D", price: 200, fillingFast: false },
        { time: "02:30 PM", type: "2D", price: 200, fillingFast: false },
        { time: "07:00 PM", type: "2D", price: 280, fillingFast: true },
        { time: "11:15 PM", type: "2D", price: 200, fillingFast: false },
      ]
    }
  ]
};

const DATES = [
  { day: 'Today', date: '14', active: true },
  { day: 'Tomorrow', date: '15', active: false },
  { day: 'Wed', date: '16', active: false },
  { day: 'Thu', date: '17', active: false },
  { day: 'Fri', date: '18', active: false },
];

export default function TheatreSelectionPage({ params }: { params: Promise<{ movieId: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const movieId = unwrappedParams.movieId;
  const movieData = MOVIES.find(m => m.id === movieId) || MOVIES[0];
  
  const [selectedDate, setSelectedDate] = useState('14');
  const [activeFormat, setActiveFormat] = useState('All');
  const setShowDetails = useBookingStore(state => state.setShowDetails);
  const { city } = useLocationStore();

  const isPlayingInCity = movieData.locations.includes(city);
  const cityTheatres = isPlayingInCity ? (CITY_THEATRES[city] || []) : [];
  
  const handleTimeSelect = (theatreName: string, time: string, format: string) => {
    setShowDetails({
      theatreName,
      showTime: time,
      showFormat: format,
      showDate: `May ${selectedDate}`
    });
    const showId = `show-${movieId}`;
    router.push(`/seatmap/${showId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-surface/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">{movieData.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 font-medium">
            <span className="px-2 py-0.5 border border-white/20 rounded text-xs">{movieData.rating}</span>
            <span>{movieData.genre}</span>
            <span>•</span>
            <span>{movieData.duration}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Dates & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {DATES.map((d) => (
              <button 
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all ${
                  selectedDate === d.date 
                    ? 'bg-primary shadow-glow-primary text-white border-none' 
                    : 'bg-surface/50 border border-white/5 hover:border-white/20 text-gray-400'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{d.day}</span>
                <span className="text-xl font-black">{d.date}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/50 border border-white/5 text-sm font-semibold hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search theatre..." 
                className="bg-surface/50 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', ...movieData.formats].map((format) => (
             <button 
               key={format}
               onClick={() => setActiveFormat(format)}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                 activeFormat === format 
                   ? 'bg-white text-black shadow-lg' 
                   : 'bg-surface border border-white/10 text-gray-300 hover:bg-white/10'
               }`}
             >
               {format}
             </button>
          ))}
        </div>

        {/* Theatres List */}
        <div className="space-y-4">
          {cityTheatres.length === 0 ? (
            <div className="text-center py-16 bg-surface/20 border border-white/5 rounded-2xl px-6">
              <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-3 animate-pulse" />
              <h3 className="text-lg font-bold text-white mb-1">No Theatres Screening in {city}</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                This movie is not currently scheduled to play in {city}. Try choosing another location from the top navigation bar.
              </p>
            </div>
          ) : (
            cityTheatres.map((theatre, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={theatre.id} 
                className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-light" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight flex items-center gap-2">
                        {theatre.name}
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold border border-primary/20">INFO</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{theatre.location} • {theatre.distance}</p>
                    </div>
                  </div>
                </div>

                {/* Show timings */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                  {theatre.timings.filter(t => activeFormat === 'All' || t.type.includes(activeFormat)).map((timing, i) => (
                    <button 
                      key={i}
                      onClick={() => handleTimeSelect(theatre.name, timing.time, timing.type)}
                      className="relative group bg-surface/50 border border-white/10 hover:border-primary hover:bg-primary/5 rounded-xl px-4 py-2 transition-all"
                    >
                      <div className="text-sm font-bold text-green-400">{timing.time}</div>
                      <div className="text-[10px] text-gray-400 font-semibold">{timing.type}</div>
                      {timing.fillingFast && (
                         <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg">FAST</div>
                      )}
                    </button>
                  ))}
                  {theatre.timings.filter(t => activeFormat === 'All' || t.type.includes(activeFormat)).length === 0 && (
                    <p className="text-sm text-gray-500">No shows available for this format.</p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
