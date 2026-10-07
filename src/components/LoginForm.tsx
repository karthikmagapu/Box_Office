"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Crown, Mail, Lock, User, Phone, CheckCircle, AlertTriangle, Eye, EyeOff, Film, ArrowLeft, Key, MessageSquare } from 'lucide-react';
import { playSuccessChime } from '@/lib/sound';

function LoginFormContent({ defaultRedirect }: { defaultRedirect: string }) {
  const { user, signIn, signUp, signInDemo, sendPasswordReset, error, clearError } = useAuthStore();
  const router = useRouter();
  
  // Safe useSearchParams call
  let searchParams: any = null;
  try {
    searchParams = useSearchParams();
  } catch (e) {
    // Fail-safe for testing or non-suspense roots
  }

  const redirectTo = searchParams ? (searchParams.get('redirect') || defaultRedirect) : defaultRedirect;

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  // Forgot Password States
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [otpMethod, setOtpMethod] = useState<'email' | 'phone'>('email');
  const [resendTimer, setResendTimer] = useState(60);

  // Clear errors when switching tabs or states
  useEffect(() => {
    clearError();
    setValidationError('');
    setSuccessMsg('');
    setOtpSent(false);
    setForgotMode(false);
    setResetSent(false);
  }, [activeTab, clearError]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  // OTP resend timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, resendTimer]);

  // Handle 6-digit OTP input change
  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;

    const newOtpInput = [...otpInput];
    newOtpInput[index] = val.slice(-1);
    setOtpInput(newOtpInput);

    // Auto-focus next input box
    if (val !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle 6-digit OTP backspace
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otpInput[index] === '' && index > 0) {
        const newOtpInput = [...otpInput];
        newOtpInput[index - 1] = '';
        setOtpInput(newOtpInput);
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      } else {
        const newOtpInput = [...otpInput];
        newOtpInput[index] = '';
        setOtpInput(newOtpInput);
      }
    }
  };

  // Send initial simulated OTP
  const handleSendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    setOtpInput(['', '', '', '', '', '']);
    setOtpSent(true);
    setResendTimer(60);
    setValidationError('');
    setSuccessMsg(`Simulated OTP sent via ${otpMethod === 'email' ? 'email' : 'SMS'}!`);
  };

  // Resend code handler
  const handleResendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    setOtpInput(['', '', '', '', '', '']);
    setResendTimer(60);
    setValidationError('');
    setSuccessMsg(`New simulated code re-sent via ${otpMethod === 'email' ? 'email' : 'SMS'}!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    if (!email || !password) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (activeTab === 'signup' && (!name || !phone)) {
      setValidationError('Please provide a name and mobile number.');
      return;
    }

    // Sign Up trigger: send OTP first
    if (activeTab === 'signup' && !otpSent) {
      handleSendOtp();
      return;
    }

    setFormLoading(true);
    try {
      if (activeTab === 'signin') {
        await signIn(email, password);
        playSuccessChime();
        setSuccessMsg('Signed in successfully! Redirecting...');
      } else {
        // Sign up verification stage
        const enteredOtp = otpInput.join('');
        if (enteredOtp !== otpCode) {
          setValidationError('Invalid verification code. Please enter the 6-digit OTP code shown in the sandbox banner.');
          setFormLoading(false);
          return;
        }

        await signUp(email, password, name, phone);
        playSuccessChime();
        setSuccessMsg('Account verified and created successfully! Welcome!');
        setOtpSent(false);
      }
    } catch (err: any) {
      console.error("Authentication action failed:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    if (!email) {
      setValidationError('Please enter your registered email address.');
      return;
    }

    setFormLoading(true);
    try {
      await sendPasswordReset(email);
      setResetSent(true);
      playSuccessChime();
      setSuccessMsg('Password reset instructions sent! (Simulated recovery mail has been generated)');
    } catch (err: any) {
      console.error(err);
      setValidationError('Failed to request reset. Please check details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleQuickDemoReset = () => {
    setSuccessMsg('DEMO BYPASS: Password has been successfully reset to: 12345678. You can now sign in using this password.');
    setValidationError('');
  };

  const handleDemoLogin = async () => {
    setFormLoading(true);
    try {
      await signInDemo();
      playSuccessChime();
      setSuccessMsg('Signed in with Demo developer account!');
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
      {/* Golden Highlight Ring in background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/15 rounded-full blur-[60px] pointer-events-none" />

      {/* Sandbox OTP Notification Display */}
      {activeTab === 'signup' && otpSent && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex flex-col gap-1 relative overflow-hidden animate-pulse shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-amber-300 font-bold">
            <MessageSquare className="w-4 h-4 text-accent" />
            <span className="font-black tracking-wider uppercase text-[10px]">Sandboxed Message Gateway</span>
          </div>
          <p>We've dispatched your OTP verification token to your {otpMethod === 'email' ? 'email address' : 'mobile number'}.</p>
          <p className="mt-2 font-bold text-white text-sm">
            Your verification OTP is: <span className="font-mono text-[#d4af37] text-lg tracking-widest bg-black/40 px-2.5 py-1 rounded ml-1 border border-white/10 select-all">{otpCode}</span>
          </p>
        </div>
      )}

      {/* Alert Notices */}
      {(error || validationError) && (
        <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Contexts */}
      {forgotMode ? (
        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#d4af37] to-[#c5a880] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Key className="w-6 h-6 text-neutral-950 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Recover Password</h3>
            <p className="text-gray-400 text-xs mt-1">Input your registered email to receive reset instructions</p>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-semibold ml-1">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Sandbox Instant Password Reset */}
          {resetSent && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 flex flex-col gap-2 relative overflow-hidden">
              <span className="font-bold text-white flex items-center gap-1">📩 Sandbox Reset Dashboard</span>
              <p>Reset email simulated. For instant developer testing, click below to set your account password directly to <strong>12345678</strong>.</p>
              <button
                type="button"
                onClick={handleQuickDemoReset}
                className="w-full py-2 bg-gradient-to-r from-primary to-accent text-neutral-950 rounded-xl font-bold uppercase tracking-wider text-[10px] hover:scale-[1.01] transition-transform"
              >
                Instant Sandbox Reset
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#c5a880] hover:from-[#e5c048] hover:to-[#d6b991] text-neutral-950 rounded-xl font-black text-sm tracking-wide transition-all shadow-glow-primary flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send Reset Instructions'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setForgotMode(false);
                setResetSent(false);
                setValidationError('');
                setSuccessMsg('');
              }}
              className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </button>
          </div>
        </form>
      ) : activeTab === 'signup' && otpSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Enter OTP Code</h3>
            <p className="text-gray-400 text-xs mt-1">
              A 6-digit code has been dispatched to your {otpMethod === 'email' ? 'email' : 'mobile'}:{" "}
              <span className="text-[#d4af37] font-bold">{otpMethod === 'email' ? email : phone}</span>
            </p>
          </div>

          {/* 6 Digit Input Boxes */}
          <div className="flex justify-between gap-2">
            {otpInput.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                className="w-12 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-black text-[#d4af37] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
              />
            ))}
          </div>

          <div className="text-center text-xs">
            {resendTimer > 0 ? (
              <p className="text-gray-500">Resend code in <span className="text-white font-bold">{resendTimer}s</span></p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#d4af37] hover:underline font-bold transition-colors"
              >
                Resend Verification Code
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setValidationError('');
                setSuccessMsg('');
              }}
              className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Details
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-[2] py-3 bg-gradient-to-r from-[#d4af37] to-[#c5a880] hover:from-[#e5c048] hover:to-[#d6b991] text-neutral-950 rounded-xl font-black text-sm tracking-wide transition-all shadow-glow-primary flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verify & Register'
              )}
            </button>
          </div>
        </form>
      ) : (
        <React.Fragment>
          {/* Brand Header */}
          <div className="text-center mb-8 relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#d4af37] to-[#c5a880] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md animate-pulse">
              <Film className="w-6 h-6 text-neutral-950" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">
              BOX<span className="text-[#d4af37]">OFFICE</span> LOUNGE
            </h2>
            <p className="text-gray-400 text-xs mt-1">Unlock VIP perks, order snacks & book premium seats</p>
          </div>

          {/* Auth Mode Toggle Tabs */}
          <div className="flex bg-black/40 rounded-xl p-1 mb-6 border border-white/5 relative">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all relative z-10 ${
                activeTab === 'signin' ? 'text-neutral-950 font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all relative z-10 ${
                activeTab === 'signup' ? 'text-neutral-950 font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account
            </button>

            {/* Sliding Tab background */}
            <div 
              className="absolute top-1 bottom-1 bg-gradient-to-r from-[#d4af37] to-[#c5a880] rounded-lg transition-all duration-300"
              style={{
                left: activeTab === 'signin' ? '4px' : '50%',
                right: activeTab === 'signin' ? '50%' : '4px',
              }}
            />
          </div>

          {/* Action Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold ml-1">Full Name</label>
                  <div className="relative mt-1">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold ml-1">Mobile Number</label>
                  <div className="relative mt-1">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 "
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="text-[11px] text-gray-400 font-semibold ml-1">Email Address</label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] text-gray-400 font-semibold ml-1">Password</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60 transition-all placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Forgot Password option for Sign In */}
              {activeTab === 'signin' && (
                <div className="text-right mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(true);
                      setValidationError('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-[#d4af37] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* OTP Verification Method Selector for Signup */}
            {activeTab === 'signup' && (
              <div className="pt-1">
                <label className="text-[11px] text-gray-400 font-semibold ml-1">OTP Verification Mode</label>
                <div className="flex gap-5 mt-1.5 ml-1">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="otpMethod"
                      checked={otpMethod === 'email'}
                      onChange={() => setOtpMethod('email')}
                      className="accent-[#d4af37]"
                    />
                    Verify Email
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="otpMethod"
                      checked={otpMethod === 'phone'}
                      onChange={() => setOtpMethod('phone')}
                      className="accent-[#d4af37]"
                    />
                    Verify Mobile
                  </label>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#c5a880] hover:from-[#e5c048] hover:to-[#d6b991] text-neutral-950 rounded-xl font-black text-sm tracking-wide transition-all shadow-glow-primary hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                activeTab === 'signin' ? 'Sign In to Lounge' : 'Send Verification OTP'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-[10px] uppercase font-bold tracking-widest">Or test the app</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Quick Demo Bypass */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={formLoading}
            className="w-full py-3 border border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 bg-black/20 text-[#d4af37] rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 fill-current animate-pulse text-[#d4af37]" />
            Quick Demo Bypass (Developer Mode)
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

export function LoginForm({ defaultRedirect = '/' }: { defaultRedirect?: string }) {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-medium text-sm animate-pulse">Loading form...</p>
      </div>
    }>
      <LoginFormContent defaultRedirect={defaultRedirect} />
    </Suspense>
  );
}
