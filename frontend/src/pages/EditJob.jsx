import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../api/axios';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setFetching(true);
        setErrorMessage(null);
        const response = await API.get(`/jobs/${id}`);
        const data = response.data?.job || response.data?.data || response.data;
        
        if (data) {
          setFormData({
            title: data.title || '',
            department: data.department || '',
            location: data.location || '',
            type: data.type || 'Full-Time',
            salary: data.salary || '',
            experience: data.experience || '',
            description: data.description || '',
            skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
            status: data.status || 'Open'
          });
        } else {
          setErrorMessage('The requested job opening record could not be parsed.');
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/');
        } else if (err.response?.status === 404) {
          setErrorMessage('Target entity record resource not found within repository registry.');
        } else {
          setErrorMessage(err.response?.data?.message || 'Error executing transactional retrieval pipeline from target PostgreSQL datastore.');
        }
      } finally {
        setFetching(false);
      }
    };

    fetchJobDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const processedSkills = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      skills: processedSkills
    };

    try {
      await API.put(`/jobs/${id}`, payload);
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed committing state mutation modifications to PostgreSQL core pipeline.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[#2563EB] animate-spin" />
          <span className="text-[14px] font-bold text-[#0F172A] tracking-tight">Syncing Database Matrix Record...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-[850px] mx-auto text-left font-sans antialiased"
    >
      <div className="mb-6">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors outline-none">
          <ArrowLeft className="w-4 h-4" /> Back to Openings
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-2">Modify Job Opening</h1>
        <p className="text-[14px] font-medium text-[#64748B]">Update parameters configuration variables mapping to sync with active corporate recruitment nodes.</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 text-[#EF4444] rounded-[16px] flex items-start gap-3 text-[14px] font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!errorMessage && (
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
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Commit Modifications'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}