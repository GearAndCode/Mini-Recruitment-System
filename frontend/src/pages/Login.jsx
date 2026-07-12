import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, Briefcase, Users, BarChart3, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../App';
import API from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill out all required interface parameters.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Integration Pipeline Execution using standard central Axios setup
      const response = await API.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        // Save login using AuthContext
        login(response.data.user, response.data.token);

        setIsLoading(false);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Interface access rejected. Check connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC] font-sans text-[#475569] selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      
      {/* LEFT SIDE: BRANDING & SYSTEM INSIGHTS */}
      <div className="hidden md:flex md:w-[45%] bg-[#0F172A] relative overflow-hidden flex-col justify-between p-12 lg:p-16 text-white border-r border-[#E2E8F0]/10">
        
        {/* Background Decorative Elements / Blurred Glassmorphism Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#2563EB]/15 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#1D4ED8]/10 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-lg shadow-[#2563EB]/20">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#F8FAFC]">
            Mini Recruitment Workflow System
          </span>
        </div>

        {/* Copywriting & Typography Context */}
        <div className="relative z-10 my-auto max-w-md">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[40px] lg:text-[48px] font-bold text-white leading-[1.1] tracking-tight mb-4"
          >
            Mini Recruitment Workflow System
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[16px] lg:text-[18px] text-[#94A3B8] font-normal leading-relaxed"
          >
            Manage candidates, jobs, applications and recruitment workflows from one centralized enterprise platform.
          </motion.p>

          {/* Centralized Core Analytics Illustration Visual Node */}
          <div className="relative mt-12 w-full h-[320px] bg-slate-800/40 rounded-2xl border border-white/5 backdrop-blur-md flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 rounded-2xl" />
            
            {/* Minimal Dashboard Mockup Graphic Elements */}
            <div className="w-[85%] h-[70%] bg-slate-900/60 rounded-xl border border-white/10 p-4 relative overflow-hidden flex flex-col gap-3">
              <div className="flex gap-1.5 items-center pb-2 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]/60" />
              </div>
              <div className="h-3 w-1/3 bg-slate-700 rounded" />
              <div className="h-2 w-full bg-slate-800 rounded" />
              <div className="h-2 w-2/3 bg-slate-800 rounded" />
              <div className="mt-2 grid grid-cols-3 gap-2 h-full">
                <div className="bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-lg" />
                <div className="bg-slate-800/50 border border-white/5 rounded-lg" />
                <div className="bg-slate-800/50 border border-white/5 rounded-lg" />
              </div>
            </div>

            {/* FLOATING CARD 1: Applications tracking metric */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-6 left-[-20px] bg-[#FFFFFF] text-[#0F172A] p-3.5 rounded-xl shadow-xl border border-[#E2E8F0] flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold tracking-wider text-[#94A3B8] m-0">Active Flow</p>
                <p className="text-[15px] font-bold text-[#0F172A] m-0">124 Applications</p>
              </div>
            </motion.div>

            {/* FLOATING CARD 2: Interviews metric */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-10 right-[-15px] bg-[#FFFFFF] text-[#0F172A] p-3.5 rounded-xl shadow-xl border border-[#E2E8F0] flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold tracking-wider text-[#94A3B8] m-0">Pipeline Stage</p>
                <p className="text-[15px] font-bold text-[#0F172A] m-0">42 Interviews</p>
              </div>
            </motion.div>

            {/* FLOATING CARD 3: Match percentage metric */}
            <motion.div 
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 right-[-25px] bg-[#0F172A] text-white p-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-2.5"
            >
              <BarChart3 className="h-4 w-4 text-[#2563EB]" />
              <span className="text-[13px] font-semibold">Candidate Match 92%</span>
            </motion.div>
          </div>
        </div>

        {/* Footer info Node */}
        <div className="relative z-10 text-[13px] text-[#94A3B8] font-normal">
          &copy; 2026 Vertex HR Systems Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: AUTHENTICATION CONTAINER */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm p-8 sm:p-10 flex flex-col"
        >
          {/* Mobile view Logo display layer */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-[#0F172A] tracking-tight">Mini Recruitment Workflow System</span>
          </div>

          {/* Form Header Nodes */}
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#0F172A] tracking-tight mb-1.5">
              Welcome Back
            </h2>
            <p className="text-[14px] text-[#475569] font-normal">
              Sign in to continue managing recruitment workflows.
            </p>
          </div>

          {/* Error handling component block */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#EF4444]/5 border border-[#EF4444]/10 text-[#EF4444] text-[14px] font-medium flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
              <span>{error}</span>
            </div>
          )}

          {/* Submission Login Form Layout */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            
            {/* Input Element: Email parameter row */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[14px] font-medium text-[#0F172A]">
                Email Address
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-[52px] pl-12 pr-4 bg-white border border-[#E2E8F0] rounded-[12px] text-[16px] text-[#0F172A] placeholder-[#94A3B8] transition-all duration-200 outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Input Element: Password parameter row */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[14px] font-medium text-[#0F172A]">
                  Password
                </label>
                <a href="#forgot" className="text-[14px] font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors outline-none focus:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-[52px] pl-12 pr-12 bg-white border border-[#E2E8F0] rounded-[12px] text-[16px] text-[#0F172A] placeholder-[#94A3B8] transition-all duration-200 outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 disabled:bg-slate-50 disabled:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-4 flex items-center text-[#94A3B8] hover:text-[#475569] transition-colors outline-none disabled:pointer-events-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox module alignment */}
            <div className="flex items-center gap-2 py-0.5">
              <input
                id="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]/20 transition disabled:opacity-50"
              />
              <label htmlFor="remember_me" className="text-[14px] font-medium text-[#475569] select-none cursor-pointer">
                Remember this device
              </label>
            </div>

            {/* Primary Action Button element block */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] mt-2 bg-[#2563EB] text-white font-semibold text-[16px] rounded-[12px] shadow-sm shadow-[#2563EB]/10 hover:bg-[#1D4ED8] hover:-translate-y-[1px] hover:shadow-md transition-all duration-200 focus:ring-4 focus:ring-[#2563EB]/20 outline-none flex items-center justify-center gap-2 active:translate-y-0 disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                  Sign In
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Route redirection anchor */}
          <div className="mt-8 text-center text-[14px]">
            <span className="text-[#475569]">Don't have an administrative account? </span>
            <button 
              onClick={() => navigate('/register')}
              disabled={isLoading}
              className="font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors hover:underline outline-none bg-transparent border-none p-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              Register here
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}