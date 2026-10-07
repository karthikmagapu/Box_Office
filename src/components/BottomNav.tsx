"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, QrCode, Ticket, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Movies', href: '/movies', icon: Film },
  { label: 'Scanner', href: '/scanner', icon: QrCode },
  { label: 'Tickets', href: '/tickets', icon: Ticket },
  { label: 'Profile', href: '/profile', icon: User },
];

export function BottomNav() {
  const { user, loading } = useAuthStore();
  const pathname = usePathname();

  // Hide bottom nav on checkout or if unauthenticated
  if (pathname.includes('/checkout')) return null;
  if (loading || !user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-primary/10 pb-safe pt-2 px-4 sm:hidden">
      <div className="flex justify-between items-center max-w-md mx-auto h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center justify-center w-full gap-1"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive ? "bg-accent/15 text-accent border border-accent/20 shadow-glow-accent" : "text-gray-400 hover:text-gray-200"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-accent font-bold" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
