"use client";

import React from 'react';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#08080c] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background radial spotlight */}
      <div className="absolute w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] -top-1/4 -z-10 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -bottom-1/4 -z-10 pointer-events-none" />
      
      <LoginForm />
    </div>
  );
}
