import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, Briefcase, Mail, Phone, 
  Layers, FileText, Loader2, AlertCircle, CheckCircle2, 
  Edit2, Clock, ShieldAlert, Award
} from 'lucide-react';
import API from "../api/axios";

export default function ViewApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Core component state matrix
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Fetch individual application profile details on mount or ID change
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/applications/${id}`);

        // Handle direct response formatting structures or wrapped envelopes defensively
        const rawData = response.data?.application || response.data?.data || response.data;
        
        if (!rawData || typeof rawData !== 'object') {
          throw new Error("Target application records appear corrupt or empty.");
        }

        // Standardized data mapping ensuring full compatibility with PostgreSQL outputs
        const mappedApplication = {
          id: rawData.id,
          appId: rawData.app_id || rawData.appId || `#APP-2026-${rawData.id}`,
          name: rawData.candidate_name || rawData.candidateName || rawData.name || 'Anonymous Candidate',
          email: rawData.email || 'N/A',
          phone: rawData.phone || 'N/A',
          experience: rawData.experience || 'Experience parameters unspecified',
          position: rawData.job_title || rawData.jobTitle || rawData.position || 'Open Allocation Position',
          department: rawData.department || rawData.team || 'General Operations',
          status: rawData.current_stage || rawData.status || 'Applied',
          date: rawData.created_at || rawData.created_date || rawData.createdDate || rawData.date || '',
          notes: rawData.notes || rawData.evaluation_notes || 'No tracking evaluation summary logged yet.',
          resume_url: rawData.resume_url || rawData.resumeUrl || null,
          cv_url: rawData.cv_url || rawData.cvUrl || null
        };

        setApplication(mappedApplication);
      } catch (err) {
        console.error("Error retrieving application track:", err);
        setError(err.response?.data?.message || err.response?.data?.error || "Could not retrieve the specified application profile details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplicationDetails();
  }, [id]);

  // Handle pipeline status transitions directly on this sheet profile view
  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      setError(null);
      
      // Fallback endpoint cascade verification structure matching typical Express routes
      try {
        await API.put(`/applications/${id}/status`, { status: newStatus });
      } catch (fallbackErr) {
        await API.patch(`/applications/${id}`, { status: newStatus, current_stage: newStatus });
      }

      setApplication(prev => ({ ...prev, status: newStatus }));
      setShowStatusModal(false);
    } catch (err) {
      console.error("Failed executing stage transition orchestration:", err);
      setError(err.response?.data?.message || "Internal mutation failure while transitioning profile gate status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Status badge dynamic color mappings mirroring your enterprise board UI themes
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Interview': return { bg: 'bg-amber-50 text-amber-700 border-amber-200/60', dot: 'bg-amber-500' };
      case 'Selected': return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500' };
      case 'Rejected': return { bg: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500' };
      default: return { bg: 'bg-blue-50 text-blue-700 border-blue-200/60', dot: 'bg-blue-500' };
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-9 h-9 text-[#2563EB] animate-spin" />
        <p className="text-[14px] font-semibold text-[#64748B]">Parsing secure application ledger...</p>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 bg-white border border-[#E2E8F0] rounded-2xl text-center shadow-sm mt-12">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-[18px] font-bold text-[#0F172A] mb-1">Pipeline Request Failed</h3>
        <p className="text-[14px] text-[#64748B] mb-6">{error}</p>
        <button 
          onClick={() => navigate('/applications')}
          className="h-[40px] px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Board
        </button>
      </div>
    );
  }

  const badge = getStatusStyle(application.status);
  const formattedDate = application.date ? new Date(application.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }) : 'Date Unspecified';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl mx-auto text-left font-sans antialiased pb-16"
    >
      {/* Action Navigation Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={() => navigate('/applications')}
            className="group h-[38px] px-3 border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#475569] text-[14px] font-semibold rounded-xl transition-all inline-flex items-center gap-2 shadow-sm outline-none mb-4"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Applications
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#0F172A] tracking-tight leading-none">
              {application.name}
            </h1>
            <span className={`px-3 py-1 border rounded-full text-[12.5px] font-bold inline-flex items-center gap-1.5 ${badge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              {application.status}
            </span>
          </div>
          <p className="text-[14px] text-[#64748B] mt-2 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#94A3B8]" /> Tracking Reference Index: <span className="font-bold text-[#475569]">{application.appId}</span>
          </p>
        </div>

        <button
          onClick={() => setShowStatusModal(true)}
          className="h-[44px] px-4 border border-[#E2E8F0] hover:border-[#2563EB] bg-white text-[#475569] hover:text-[#2563EB] text-[14px] font-semibold rounded-xl transition-all inline-flex items-center gap-2 shadow-sm outline-none self-start sm:self-center"
        >
          <Edit2 className="w-4 h-4" /> Edit Status Stage
        </button>
      </div>

      {/* Embedded Action Feedback Warning Dropdown Banner */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-[14px] rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main Structural Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
        
        {/* Left Column Stack: Professional Assignment Information */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Section Block 1: Target Position Allocations */}
          <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#2563EB]" /> Target Assignment Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Target Corporate Track</span>
                <p className="text-[16px] font-bold text-[#0F172A]">{application.position}</p>
              </div>
              <div>
                <span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Department Unit</span>
                <p className="text-[16px] font-medium text-[#475569]">{application.department}</p>
              </div>
              <div>
                <span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Submission Timeline Metric</span>
                <p className="text-[14px] font-semibold text-[#475569] inline-flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-[#64748B]" /> {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Section Block 2: Structural Evaluation Logs */}
          <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563EB]" /> Core Assessment Notes
            </h3>
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <p className="text-[14px] font-medium text-[#334155] leading-relaxed whitespace-pre-wrap">
                {application.notes}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column Stack: Candidate Communications & Credentials */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#2563EB]" /> Contact Credentials
            </h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 mt-0.5 shrink-0">
                  <Mail className="w-4 h-4 text-[#64748B]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wider block">Primary Communication Key</span>
                  <a href={`mailto:${application.email}`} className="text-[14px] font-semibold text-[#2563EB] hover:underline break-all">{application.email}</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 mt-0.5 shrink-0">
                  <Phone className="w-4 h-4 text-[#64748B]" />
                </div>
                <div>
                  <span className="text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wider block">Telephone Network Channel</span>
                  <p className="text-[14px] font-bold text-[#334155]">{application.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#F1F5F9]">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 mt-0.5 shrink-0">
                  <Award className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div>
                  <span className="text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wider block">Vetted Profile Domain Experience</span>
                  <p className="text-[14px] font-bold text-[#0F172A] mt-0.5">{application.experience}</p>
                </div>
              </div>

              {/* Dynamic CV Evaluation Module Action Row */}
              <div className="relative group/cv w-full pt-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => {
                    const targetUrl = application?.resume_url || application?.cv_url;
                    if (targetUrl && targetUrl.trim() !== "") {
                      window.open(targetUrl, "_blank", "noopener,noreferrer");
                    } else {
                      const warningBox = document.getElementById("cv-toast-warning-fallback");
                      if (warningBox) {
                        warningBox.classList.remove("opacity-0", "translate-y-1", "pointer-events-none");
                        warningBox.classList.add("opacity-100", "translate-y-0");
                        setTimeout(() => {
                          warningBox.classList.add("opacity-0", "translate-y-1", "pointer-events-none");
                          warningBox.classList.remove("opacity-100", "translate-y-0");
                        }, 3000);
                      }
                    }
                  }}
                  className="w-full h-[44px] px-4 border border-[#E2E8F0] hover:border-[#2563EB] bg-white text-[#475569] hover:text-[#2563EB] text-[14px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download CV
                </button>

                {/* Micro-Interaction Absolute Toast Context Alert Layer */}
                <div 
                  id="cv-toast-warning-fallback" 
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap transition-all duration-200 opacity-0 translate-y-1 pointer-events-none z-50 flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FDA4AF" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  No CV uploaded.
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Absolute Overlaid Modal Control Panel Matrix for Transition Updates */}
      <AnimatePresence>
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !updatingStatus && setShowStatusModal(false)}
              className="absolute inset-0 bg-[#0F172A]/30 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xl w-full max-w-md relative z-10 text-left"
            >
              <h3 className="text-[18px] font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2563EB]" /> Mutate Pipeline Gate Position
              </h3>
              <p className="text-[13.5px] text-[#64748B] mb-5 font-medium">
                Transition this candidate configuration layout instantly across active system indexes.
              </p>

              <div className="flex flex-col gap-2">
                {['Applied', 'Screening', 'Interview', 'Offer', 'Selected', 'Rejected'].map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleStatusUpdate(stage)}
                    className={`w-full h-[42px] px-4 text-left rounded-xl font-semibold text-[13.5px] flex items-center justify-between border transition-all ${
                      application.status === stage 
                        ? 'bg-[#2563EB]/5 border-[#2563EB] text-[#2563EB]' 
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <span>{stage}</span>
                    {application.status === stage && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end mt-6 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => setShowStatusModal(false)}
                  className="h-[38px] px-4 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[13.5px] font-semibold rounded-xl transition-colors outline-none"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}