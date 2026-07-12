import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Shield, ArrowRight, 
  CheckCircle2, AlertCircle, Briefcase 
} from 'lucide-react';
import API from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  
  // State Matrix
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'recruiter' // Default value matching requirements
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Field Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors inline as user corrects inputs
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  // Explicit Form Validator
  const validateForm = () => {
    const localErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) localErrors.name = 'Full name is required';
    
    if (!formData.email.trim()) {
      localErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      localErrors.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      localErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      localErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      localErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      localErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  // Pipeline Execution
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || loading) return;

setLoading(true);    setServerError('');

    try {
      // Outbound REST Payload Structure matching requirements
      await API.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      });

      setIsSuccess(true);
      // Clean separation of concerns, routing instantly upon record allocation
      setTimeout(() => {
        navigate("/", {
          state: {
            registered: true,
            email: formData.email.trim()
          }
        });
      }, 1500);
    } catch (err) {
      const backendMessage = err.response?.data?.message || 'Identity provisioning handshake failed.';
      setServerError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC] font-sans text-[#475569] selection:bg-[#2563EB]/10 selection:text-[#2563EB]">      
      
      {/* LEFT SIDE: BRANDING PANEL (50%) */}
      <div className="hidden md:flex md:w-1/2 bg-[#0F172A] p-12 lg:p-16 flex-col justify-between relative overflow-hidden text-white border-r border-[#E2E8F0]/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10">
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center font-black text-white text-[14px] shadow-lg shadow-[#2563EB]/30 mb-8">
            MR
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Mini Recruitment<br />Workflow System
          </h1>
          <p className="text-slate-400 text-base mt-4 leading-relaxed max-w-md">
            Provision infrastructure nodes, audit administrative permissions, and track active candidate lifecycles inside a singular deployment shell.
          </p>
        </div>

        <div className="relative z-10 border-t border-slate-800/80 pt-6 mt-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800/60 rounded-lg text-[#2563EB]">
              <Shield className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 font-medium leading-normal">
              Enterprise Data Matrix Isolation Enabled.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: REGISTRATION FORM CONTAINER (50%) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md mx-auto">
          
          {/* Mobile view Logo display layer */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB] flex items-center justify-center font-black text-white text-xs">
              MR
            </div>
            <span className="text-lg font-bold text-[#0F172A] tracking-tight">Mini Recruitment Workflow System</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Create Admin Node</h2>
            <p className="text-sm text-slate-500 mt-1.5">Register administrative credentials below to sync with our datastore matrix.</p>
          </div>

          {/* Error Dispatch Unit */}
          {serverError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-red-700 leading-normal">{serverError}</div>
            </motion.div>
          )}

          {/* Success Dispatch Unit */}
          {isSuccess && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2.5 mb-5">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-green-700 leading-normal">Account provisioned successfully. Routing token handshake...</div>
            </motion.div>
          )}

          {/* Input Transaction Shell */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Field: Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-400" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={`w-full h-[46px] pl-10 pr-4 bg-[#F8FAFC] border ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-[#E2E8F0] focus:border-[#2563EB]'} rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-slate-400`}
                />
              </div>
              {errors.name && <span className="text-[11px] font-semibold text-red-500 mt-0.5">{errors.name}</span>}
            </div>

            {/* Field: Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-400" />
                <input 
                  type="text" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@enterprise.com"
                  className={`w-full h-[46px] pl-10 pr-4 bg-[#F8FAFC] border ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-[#E2E8F0] focus:border-[#2563EB]'} rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-slate-400`}
                />
              </div>
              {errors.email && <span className="text-[11px] font-semibold text-red-500 mt-0.5">{errors.email}</span>}
            </div>

            {/* Field: Role Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">System Access Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-[46px] pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl text-[14px] font-semibold text-[#0F172A] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 border-l border-slate-200 pl-2 text-[10px] font-bold">▼</div>
              </div>
            </div>

            {/* Field: Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-400" />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full h-[46px] pl-10 pr-4 bg-[#F8FAFC] border ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-[#E2E8F0] focus:border-[#2563EB]'} rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-slate-400`}
                />
              </div>
              {errors.password && <span className="text-[11px] font-semibold text-red-500 mt-0.5">{errors.password}</span>}
            </div>

            {/* Field: Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-400" />
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full h-[46px] pl-10 pr-4 bg-[#F8FAFC] border ${errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-[#E2E8F0] focus:border-[#2563EB]'} rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-slate-400`}
                />
              </div>
              {errors.confirmPassword && <span className="text-[11px] font-semibold text-red-500 mt-0.5">{errors.confirmPassword}</span>}
            </div>

            {/* Submit Action Block */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-[#2563EB] hover:bg-[#1d4ed8] disabled:bg-slate-400 text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all mt-2 outline-none cursor-pointer shadow-md shadow-[#2563EB]/10"
            >
              {loading ? 'Executing Registry Allocation...' : 'Register Administrative Matrix'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

          </form>

          {/* Navigation Matrix Link */}
          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already configured an operational identity?{' '}
              <Link to="/" className="text-[#2563EB] font-bold hover:underline outline-none">
                Sign In Instead
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}