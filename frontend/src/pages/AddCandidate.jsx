import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, Save, AlertCircle, Briefcase, Sparkles } from 'lucide-react';
import API from "../api/axios";

export default function AddCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form Field States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: '',
    resumeName: '',
    status: 'Applied'
  });

  // UI State Management
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [errors, setErrors] = useState({});

  // Lifecycle: Prefill matching records if operating under Edit Mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchCandidateDetails = async () => {
      try {
        setFetching(true);
        const response = await API.get(`/candidates/${id}`);
        const data = response.data?.data || response.data;
        
        if (data) {
         setFormData({
  name: data.full_name || '',
  email: data.email || '',
  phone: data.phone || '',
  position: data.position_applied || '',
  experience: data.experience ? String(data.experience) : '',
  skills: '',
  resumeName: data.resume_link || '',
  status: data.status || 'Applied'
});
        }
      } catch (err) {
        console.error("Failed to prefill candidate context payload:", err);
        setErrors({ global: "Failed to locate target candidate record data profiles from database." });
      } finally {
        setFetching(false);
      }
    };

    fetchCandidateDetails();
  }, [id, isEditMode]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // UI Input Validation Logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name designation parameter is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Primary electronic correspondence mail index is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please input a valid email route context matrix.";
    }
    if (!formData.position.trim()) newErrors.position = "Operational job framework target is required.";
    if (!formData.experience.trim()) newErrors.experience = "Experience duration value scale tracking is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Processing
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    // Process input data fields cleanly for database compliance
    const formattedSkills = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const payload = {
  full_name: formData.name,
  email: formData.email,
  phone: formData.phone,
  position_applied: formData.position,
  experience: parseInt(formData.experience, 10),
  resume_link: formData.resumeName,
  status: formData.status
};

    try {
      if (isEditMode) {
        await API.put(`/candidates/${id}`, payload);
      } else {
await API.post('/candidates', payload);      }
      navigate('/candidates');
    } catch (err) {
      console.error("Error committing database changes:", err);
      setErrors({ global: err.response?.data?.message || "Failed to commit candidate workspace profile configuration changes." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
        <p className="mt-4 text-[14px] font-medium text-[#64748B]">Fetching candidate record identity details...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[820px] w-full mx-auto text-left"
    >
      {/* Back Link Breadcrumb Header */}
      <div className="mb-6">
        <Link to="/candidates" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Candidates Tracking Board
        </Link>
      </div>

      {/* Main Title Banner Header Node Block */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] tracking-tight mb-2">
            {isEditMode ? 'Modify Candidate Profile' : 'Register New Candidate'}
          </h1>
          <p className="text-[14px] font-medium text-[#64748B]">
            {isEditMode ? 'Amend operational parameters on candidate information profiles matching record states.' : 'Populate target tracking fields to append pipeline entries into system indexes.'}
          </p>
        </div>
        <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-[#2563EB]/5 text-[#2563EB] items-center justify-center shrink-0">
          <UserPlus className="w-5 h-5" />
        </div>
      </div>

      {/* Global Error Context Flash Alert Board */}
      {errors.global && (
        <div className="mb-6 p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 text-[#EF4444] rounded-2xl flex items-start gap-3 text-[14px] font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errors.global}</span>
        </div>
      )}

      {/* Structured Layout Entry Form Input Wrapper Grid */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Field Component: Candidate Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Full Candidate Name *</label>
            <input 
              type="text"
              name="name"
              placeholder="e.g. Courtney Henry"
              value={formData.name}
              onChange={handleChange}
              className={`h-[46px] px-4 border rounded-xl text-[14px] font-medium outline-none transition-all ${
                errors.name ? 'border-#{EF4444} bg-[#EF4444]/5 focus:border-[#EF4444]' : 'border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#2563EB] focus:bg-white'
              }`}
            />
            {errors.name && <p className="text-[12px] font-medium text-[#EF4444] mt-0.5">{errors.name}</p>}
          </div>

          {/* Field Component: Candidate Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Email Address *</label>
            <input 
              type="text"
              name="email"
              placeholder="e.g. courtney.h@vertex.io"
              value={formData.email}
              onChange={handleChange}
              className={`h-[46px] px-4 border rounded-xl text-[14px] font-medium outline-none transition-all ${
                errors.email ? 'border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]' : 'border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#2563EB] focus:bg-white'
              }`}
            />
            {errors.email && <p className="text-[12px] font-medium text-[#EF4444] mt-0.5">{errors.email}</p>}
          </div>

          {/* Field Component: Candidate Phone */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Contact Phone Number</label>
            <input 
              type="text"
              name="phone"
              placeholder="e.g. +1 (555) 019-2834"
              value={formData.phone}
              onChange={handleChange}
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#2563EB] focus:bg-white rounded-xl text-[14px] font-medium outline-none transition-all text-[#0F172A]"
            />
          </div>

          {/* Field Component: Position Applied */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Target Position *</label>
            <input 
              type="text"
              name="position"
              placeholder="e.g. Senior Full Stack Engineer"
              value={formData.position}
              onChange={handleChange}
              className={`h-[46px] px-4 border rounded-xl text-[14px] font-medium outline-none transition-all ${
                errors.position ? 'border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]' : 'border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#2563EB] focus:bg-white'
              }`}
            />
            {errors.position && <p className="text-[12px] font-medium text-[#EF4444] mt-0.5">{errors.position}</p>}
          </div>

          {/* Field Component: Years of Experience */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Years of Experience *</label>
            <input 
              type="number"
              name="experience"
              placeholder="e.g. 5"
              min="0"
              max="50"
              value={formData.experience}
              onChange={handleChange}
              className={`h-[46px] px-4 border rounded-xl text-[14px] font-medium outline-none transition-all ${
                errors.experience ? 'border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]' : 'border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#2563EB] focus:bg-white'
              }`}
            />
            {errors.experience && <p className="text-[12px] font-medium text-[#EF4444] mt-0.5">{errors.experience}</p>}
          </div>

          {/* Field Component: Status Pipeline Stage Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Workflow Placement Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#2563EB] focus:bg-white rounded-xl text-[14px] font-semibold text-[#475569] outline-none cursor-pointer hover:border-[#64748B] transition-all"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>

        {/* Field Component: Skills String Mapping (Full Width) */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Core Technological Skills (Comma Separated)</label>
          <input 
            type="text"
            name="skills"
            placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
            value={formData.skills}
            onChange={handleChange}
            className="w-full h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#2563EB] focus:bg-white rounded-xl text-[14px] font-medium outline-none transition-all text-[#0F172A]"
          />
          <p className="text-[11px] font-medium text-[#94A3B8]">Delimit individual tool indexing terms explicitly with commas to organize skill tags.</p>
        </div>

        {/* Field Component: Resume Asset Resource Document Route */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Resume Document Name / Path Location (Optional)</label>
          <input 
            type="text"
            name="resumeName"
            placeholder="e.g. Courtney_CV_2026.pdf"
            value={formData.resumeName}
            onChange={handleChange}
            className="w-full h-[46px] px-4 border border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#2563EB] focus:bg-white rounded-xl text-[14px] font-medium outline-none transition-all text-[#0F172A]"
          />
        </div>

        {/* Divider Visual Layout line Break */}
        <div className="h-[1px] w-full bg-[#E2E8F0] my-2" />

        {/* Bottom Form Actions Controller Layout */}
        <div className="flex items-center justify-end gap-3.5">
          <Link to="/candidates">
            <button 
              type="button" 
              className="h-[44px] px-5 border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] text-[14px] font-bold rounded-xl transition-all outline-none"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="h-[44px] px-6 bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-50 text-[14px] font-bold rounded-xl transition-all shadow-sm shadow-[#2563EB]/10 flex items-center gap-2 outline-none"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditMode ? 'Update Profile Data' : 'Save System Record'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}