import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import API from '../api/axios';

export default function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    experience: '',
    description: '',
    skills: '',
    status: 'Open'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Transform technical skill list values into array strings before flight
    const processedSkills = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      skills: processedSkills
    };

    try {
      // The Axios instance already prefixes '/api', target clean endpoint directly
      await API.post('/jobs', payload);
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Operational communication failure posting job deployment payload context.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-[850px] mx-auto text-left font-sans antialiased"
    >
      <div className="mb-6">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors outline-none">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard List
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-2">Launch New Job Posting</h1>
        <p className="text-[14px] font-medium text-[#64748B]">Fill in the structural specifications parameters matrix below to distribute the opening parameters.</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 text-[#EF4444] rounded-[16px] flex items-start gap-3 text-[14px] font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Job Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Department</label>
            <input 
              type="text" 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              required 
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Location</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              required 
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Employment Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-bold text-[#475569] outline-none transition-all"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Salary Range</label>
            <input 
              type="text" 
              name="salary" 
              placeholder="e.g. $90,000 - $120,000"
              value={formData.salary} 
              onChange={handleChange} 
              required 
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Required Experience</label>
            <input 
              type="text" 
              name="experience" 
              placeholder="e.g. 3+ Years"
              value={formData.experience} 
              onChange={handleChange} 
              required 
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Required Skills (Comma Separated)</label>
          <input 
            type="text" 
            name="skills" 
            placeholder="React, PostgreSQL, TailwindCSS, TypeScript"
            value={formData.skills} 
            onChange={handleChange} 
            required 
            className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition-all" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Job Description</label>
            <textarea 
              name="description" 
              rows={4}
              value={formData.description} 
              onChange={handleChange} 
              required 
              className="p-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-medium text-[#0F172A] outline-none resize-none transition-all" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] rounded-xl text-[14px] font-bold text-[#475569] outline-none transition-all"
            >
              <option value="Open">Open</option>
              <option value="Urgent Hiring">Urgent Hiring</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 border-t border-[#E2E8F0] pt-6">
          <Link to="/jobs" className="h-[44px] px-5 border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] text-[14px] font-bold rounded-xl flex items-center transition-colors outline-none">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="h-[44px] px-6 bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-50 text-[14px] font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all outline-none"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save System Record'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}