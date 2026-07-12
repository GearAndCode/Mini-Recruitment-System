import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit3, Download, X, Save, User, Mail, Phone, 
  Briefcase, Award, FileText, Calendar, ShieldCheck, Loader2, AlertCircle 
} from 'lucide-react';
import API from "../api/axios";

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine mode dynamically from route context
  const isEditMode = location.pathname.includes('/edit/');

  // UI Staging States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Core Data Forms
  const [candidate, setCandidate] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    position_applied: '',
    experience: 0,
    resume_link: '',
    status: 'Applied'
  });

  // Fetch Data on Ingestion Loop
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/candidates/${id}`);
        
        if (response.data && response.data.success) {
          const data = response.data.candidate;
          setCandidate(data);
          setFormData({
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            position_applied: data.position_applied || '',
            experience: data.experience || 0,
            resume_link: data.resume_link || '',
            status: data.status || 'Applied'
          });
        } else {
          throw new Error("Target record could not be securely verified.");
        }
      } catch (err) {
        console.error("Ingestion fault:", err);
        setError(err.response?.data?.message || "Failed to retrieve candidate profile context from production database.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCandidateData();
  }, [id]);

  // Handle Controlled Input Adjustments
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value, 10) || 0 : value
    }));
  };

  // Push Modifications to PostgreSQL Infrastructure
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(false);
      setError(null);
      
      const response = await API.put(`/candidates/${id}`, formData);
      
      if (response.data && response.data.success) {
        // Trigger temporary contextual Toast warning/success banner
        setToast({ show: true, message: 'Changes synchronized to remote database infrastructure successfully!' });
        
        setTimeout(() => {
          setToast({ show: false, message: '' });
          navigate('/candidates');
        }, 2000);
      }
    } catch (err) {
      console.error("Mutation layer synchronization fault:", err);
      setError(err.response?.data?.message || "Failed to finalize database transaction modifications.");
    }
  };

  // Extract initials secure parsing strategy for fallback avatars
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Shimmer / Suspense Loading Element Screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Parsing registry records...</p>
      </div>
    );
  }

  // Network / Integrity Validation Fault Notification
  if (error && !candidate) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 max-w-2xl mx-auto my-10">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <div>
          <h4 className="font-bold text-slate-900">System Pipeline Failure</h4>
          <p className="text-sm mt-0.5">{error}</p>
          <button onClick={() => navigate('/candidates')} className="mt-3 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Return to Tracking Registry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto px-4 py-8 font-sans text-left text-slate-800 antialiased"
    >
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 text-sm"
          >
            <ShieldCheck className="w-4 h-4" /> {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation & Operational Action Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button 
          onClick={() => navigate('/candidates')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group outline-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Candidates
        </button>

        {!isEditMode && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (candidate?.resume_link) window.open(candidate.resume_link, '_blank');
                else alert('No external URL link registered for this entity.');
              }}
              className="h-[40px] px-4 border border-slate-200 hover:border-blue-600 bg-white text-slate-600 hover:text-blue-600 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 outline-none"
            >
              <Download className="w-4 h-4" /> Download Resume
            </button>
            <button
              onClick={() => navigate(`/candidates/edit/${id}`)}
              className="h-[40px] px-4 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/15 flex items-center gap-2 outline-none"
            >
              <Edit3 className="w-4 h-4" /> Edit Candidate
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Primary Context Workspace Forms */}
      <form onSubmit={handleSaveChanges}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT PANEL: Identity Badge & Metadata Fields */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 font-extrabold text-2xl tracking-wider mb-4 shadow-inner">
              {getInitials(isEditMode ? formData.full_name : candidate?.full_name)}
            </div>
            
            {isEditMode ? (
              <div className="w-full mb-2">
                <input 
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Full Name"
                  className="w-full text-center font-bold text-xl text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-1.5 outline-none transition"
                />
              </div>
            ) : (
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">{candidate?.full_name}</h2>
            )}

            {isEditMode ? (
              <div className="w-full mb-4">
                <input 
                  type="text"
                  name="position_applied"
                  value={formData.position_applied}
                  onChange={handleInputChange}
                  required
                  placeholder="Target Allocation Role"
                  className="w-full text-center text-sm font-semibold text-blue-600 bg-blue-50/50 border border-transparent focus:border-blue-500 rounded-lg px-2 py-1 outline-none transition"
                />
              </div>
            ) : (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                {candidate?.position_applied}
              </span>
            )}

            <div className="w-full border-t border-slate-100 pt-4 mt-2 flex flex-col gap-3 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Candidate Tracking ID</span>
                <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">#CAN-{candidate?.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">System Ingestion Date</span>
                <span className="font-medium text-slate-600 inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                  {candidate?.created_at ? new Date(candidate.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Comprehensive Core HR Profile Fields Matrix */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Candidate Dossier & Operational Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              
              {/* Field: Email Link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Registration
                </label>
                {isEditMode ? (
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 h-[42px] outline-none transition"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900 bg-slate-50/50 border border-slate-100/50 rounded-xl px-3 py-2.5 min-h-[42px] truncate">
                    {candidate?.email || 'N/A'}
                  </p>
                )}
              </div>

              {/* Field: Phone Link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Numbers
                </label>
                {isEditMode ? (
                  <input 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 h-[42px] outline-none transition"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900 bg-slate-50/50 border border-slate-100/50 rounded-xl px-3 py-2.5 min-h-[42px]">
                    {candidate?.phone || 'N/A'}
                  </p>
                )}
              </div>

              {/* Field: Experience Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-400" /> Experience Metrics
                </label>
                {isEditMode ? (
                  <input 
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 h-[42px] outline-none transition"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900 bg-slate-50/50 border border-slate-100/50 rounded-xl px-3 py-2.5 min-h-[42px]">
                    {candidate?.experience} {candidate?.experience === 1 ? 'Year' : 'Years'} Active Professional Practice
                  </p>
                )}
              </div>

              {/* Field: Pipeline Stage Gate Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Pipeline Funnel Stage
                </label>
                {isEditMode ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 h-[42px] outline-none transition cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                ) : (
                  <div className="flex items-center min-h-[42px]">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${
                      candidate?.status === 'Selected' || candidate?.status === 'Offer' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                      candidate?.status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                      candidate?.status === 'Interview' || candidate?.status === 'Screening' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      'bg-blue-50 border-blue-200 text-blue-700'
                    }`}>
                      {candidate?.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Field: Resume Asset Link Allocation */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> File Storage URL (Resume Document Link)
                </label>
                {isEditMode ? (
                  <input 
                    type="url"
                    name="resume_link"
                    value={formData.resume_link}
                    onChange={handleInputChange}
                    placeholder="https://example.com/storage/resume.pdf"
                    className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 h-[42px] outline-none transition"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-slate-500 truncate">{candidate?.resume_link || 'No resume link configuration present.'}</span>
                    {candidate?.resume_link && (
                      <a 
                        href={candidate.resume_link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 shrink-0 select-none hover:underline"
                      >
                        Open Target Document &rarr;
                      </a>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Form Actions for Edit Mode Context */}
            {isEditMode && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/candidates/${id}`)}
                  disabled={submitting}
                  className="h-[44px] px-5 border border-slate-200 bg-white text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition active:scale-98 disabled:opacity-50 flex items-center gap-2 outline-none"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-[44px] px-5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition active:scale-98 shadow-md shadow-blue-600/15 disabled:opacity-50 flex items-center gap-2 outline-none"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </motion.div>
            )}

          </div>
        </div>
      </form>
    </motion.div>
  );
}