"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Crosshair, X, Search, Loader2 } from 'lucide-react';

const CITIES = ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Chennai', 'Pune', 'Kolkata', 'Kochi'];

const CITY_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Delhi-NCR': { lat: 28.6139, lng: 77.2090 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Kochi': { lat: 9.9312, lng: 76.2673 }
};

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  onSelectCity: (city: string) => void;
}

export const LocationModal = ({ isOpen, onClose, currentCity, onSelectCity }: LocationModalProps) => {
  const [search, setSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const dLat = lat1 - lat2;
    const dLng = lng1 - lng2;
    return dLat * dLat + dLng * dLng; // squared distance is enough to compare
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    
    const fallbackToGeoIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const detectedCity = data.city;
        
        if (detectedCity) {
          // If the detected city matches one of our popular cities directly
          const matched = Object.keys(CITY_COORDINATES).find(
            c => c.toLowerCase().includes(detectedCity.toLowerCase()) || detectedCity.toLowerCase().includes(c.toLowerCase())
          );
          
          if (matched) {
            onSelectCity(matched);
          } else if (data.latitude && data.longitude) {
            // Find closest city from coordinates
            let closestCity = 'Hyderabad';
            let minDistance = Infinity;
            
            for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
              const dist = getDistance(data.latitude, data.longitude, coords.lat, coords.lng);
              if (dist < minDistance) {
                minDistance = dist;
                closestCity = cityName;
              }
            }
            onSelectCity(closestCity);
          } else {
            onSelectCity('Hyderabad');
          }
        } else {
          onSelectCity('Hyderabad');
        }
      } catch (err) {
        console.warn("GeoIP lookup failed, defaulting to Hyderabad:", err);
        onSelectCity('Hyderabad');
      } finally {
        setIsDetecting(false);
        onClose();
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let closestCity = 'Hyderabad';
          let minDistance = Infinity;
          
          for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
            const dist = getDistance(latitude, longitude, coords.lat, coords.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestCity = cityName;
            }
          }
          
          onSelectCity(closestCity);
          setIsDetecting(false);
          onClose();
        },
        async (error) => {
          console.warn("HTML5 Geolocation failed. Using GeoIP fallback:", error);
          await fallbackToGeoIP();
        },
        { timeout: 6000 }
      );
    } else {
      await fallbackToGeoIP();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-lg bg-surface border border-white/10 rounded-2xl shadow-glass overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-light" />
                Select Your Location
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for your city..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm placeholder:text-gray-500"
                />
              </div>

              <button 
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 text-primary-light font-bold hover:bg-primary/20 border border-primary/20 transition-colors mb-6 disabled:opacity-50"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Detecting Location...
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4" />
                    Detect my location
                  </>
                )}
              </button>

              <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Popular Cities</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredCities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors border ${
                      currentCity === city 
                        ? 'bg-primary border-primary text-white shadow-glow-primary'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-gray-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
