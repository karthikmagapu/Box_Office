"use client";

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useLocationStore } from '@/store/locationStore';

export function AuthInitializer() {
  const { initAuthListener, user, loading } = useAuthStore();
  const { initialize } = useLocationStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => {
      unsubscribe();
    };
  }, [initAuthListener]);

  // Centralized Route Protection
  useEffect(() => {
    if (!loading && !user) {
      // Protect all pages except home '/' and the login page '/login'
      if (pathname !== '/' && pathname !== '/login') {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [loading, user, pathname, router]);

  return null;
}
