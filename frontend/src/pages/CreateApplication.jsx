import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Briefcase, FileText, ArrowLeft, Loader2, 
  AlertCircle, CheckCircle, Search, ChevronDown 
} from 'lucide-react';
import API from "../api/axios";

export default function CreateApplication() {
  const navigate = useNavigate();
  
  // Dynamic Datasets from Backend
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  // Core Component State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uiError, setUiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Form Fields State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [notes, setNotes] = useState('');

  // Searchable Dropdowns Local Filtering States
  const [candidateSearch, setCandidateSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [showCandidateDropdown, setShowCandidateDropdown] = useState(false);
  const [showJobDropdown, setShowJobDropdown] = useState(false);

  // Focus and click-outside handling references
  const candidateRef = useRef(null);
  const jobRef = useRef(null);

  // Fetch Candidates and Jobs asynchronously on mount
  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        setLoading(true);
        setUiError(null);

        const [candidatesRes, jobsRes] = await Promise.all([
          API.get("/candidates"),
          API.get("/jobs")
        ]);

        // Support direct array format or wrapped payloads (.data / .data.candidates) safely
        const extractedCandidates = Array.isArray(candidatesRes.data) ? candidatesRes.data : (candidatesRes.data?.candidates || candidatesRes.data?.data || []);
        const extractedJobs = Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data?.jobs || jobsRes.data?.data || []);

        setCandidates(extractedCandidates);
        setJobs(extractedJobs);
      } catch (err) {
        console.error("Error fetching dependencies:", err);
        setUiError("Failed to initialize system catalogs. Please verify backend state.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequiredData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (candidateRef.current && !candidateRef.current.contains(event.target)) {
        setShowCandidateDropdown(false);
      }
      if (jobRef.current && !jobRef.current.contains(event.target)) {
        setShowJobDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter lists based on searchable strings
  const filteredCandidates = candidates.filter(c => {
    const fullName = `${c.first_name || ''} ${c.last_name || ''}` || c.name || '';
    return fullName.toLowerCase().includes(candidateSearch.toLowerCase()) || 
           (c.email && c.email.toLowerCase().includes(candidateSearch.toLowerCase()));
  });

  const filteredJobs = jobs.filter(j => {
    const title = j.title || j.job_title || '';
    const department = j.department || j.team || '';
    return title.toLowerCase().includes(jobSearch.toLowerCase()) || 
           department.toLowerCase().includes(jobSearch.toLowerCase());
  });

  // Client-Side Validation Processing Checklist
  const validateForm = () => {
    const errors = {};
    if (!selectedCandidate) errors.candidate_id = "Candidate selection is strictly required.";
    if (!selectedJob) errors.job_id = "Target structural job assignment is required.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setUiError(null);
      setValidationErrors({});

      const payload = {
        candidate_id: selectedCandidate.id,
        job_id: selectedJob.id,
        notes: notes.trim()
      };

      await API.post("/applications", payload);
      navigate("/applications");
    } catch (err) {
      console.error("Submission operational failure:", err);
      if (err.response && err.response.data) {
        // Intercept backend-specific validation parameters if available
        if (err.response.data.errors) {
          setValidationErrors(err.response.data.errors);
        } else {
          setUiError(err.response.data.message || err.response.data.error || "Backend transactional failure detected.");
        }
      } else {
        setUiError("Network connection interrupted. Unable to reach application router.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-[15px] font-semibold text-[#64748B]">Configuring recruitment pipelines...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto text-left font-sans antialiased pb-12"
    >
      {/* Navigation Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/applications')}
          className="group h-[38px] px-3 border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#475569] text-[14px] font-semibold rounded-xl transition-all inline-flex items-center gap-2 shadow-sm outline-none mb-4"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Pipeline
        </button>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] tracking-tight leading-none mb-2">
          Create Application
        </h1>
        <p className="text-[14px] sm:text-[15px] font-medium text-[#64748B]">
          Link an evaluated profile with an open corporate position track instance.
        </p>
      </div>

      {/* Global Error Banner */}
      {uiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[14px] rounded-2xl flex items-start gap-2.5 shadow-sm animate-shake">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span className="font-medium">{uiError}</span>
        </div>
      )}

      {/* Core Architectural Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        
        {/* 1. SEARCHABLE CANDIDATE DROPDOWN FIELD */}
        <div className="flex flex-col gap-2" ref={candidateRef}>
          <label className="text-[13.5px] font-bold text-[#334155] tracking-wide inline-flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#64748B]" /> Candidate Profile <span className="text-red-500">*</span>
          </label>
          
          <div className="relative">
            <div 
              onClick={() => !submitting && setShowCandidateDropdown(!showCandidateDropdown)}
              className={`w-full h-[46px] px-4 bg-[#F8FAFC] border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                validationErrors.candidate_id ? 'border-red-300 ring-4 ring-red-500/5' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
              } ${showCandidateDropdown ? 'border-[#2563EB] ring-4 ring-[#2563EB]/5 bg-white' : ''}`}
            >
              <span className={`text-[14px] font-medium ${selectedCandidate ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                {selectedCandidate 
                  ? `${selectedCandidate.first_name || ''} ${selectedCandidate.last_name || ''} (${selectedCandidate.email || 'No email'})` 
                  : "Search and allocate candidate entity..."
                }
              </span>
              <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${showCandidateDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Portal Block */}
            {showCandidateDropdown && (
              <div className="absolute top-[52px] left-0 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2 border-b border-[#E2E8F0] bg-[#F8FAFC] sticky top-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                    <input 
                      type="text"
                      placeholder="Type structural candidate context name or mail key..."
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                      className="w-full h-[36px] pl-8 pr-3 border border-[#E2E8F0] focus:border-[#2563EB] rounded-lg text-[13px] font-medium outline-none bg-white transition-all text-[#0F172A]"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-[220px] overflow-y-auto p-1.5 flex flex-col gap-0.5">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map(c => {
                      const name = `${c.first_name || ''} ${c.last_name || ''}` || c.name || 'Unknown Candidate';
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedCandidate(c);
                            setShowCandidateDropdown(false);
                            setCandidateSearch('');
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors flex flex-col gap-0.5 ${
                            selectedCandidate?.id === c.id ? 'bg-[#2563EB]/5 text-[#2563EB]' : 'text-[#334155] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <span>{name}</span>
                          <span className="text-[11.5px] text-[#64748B]">{c.email || 'No primary email specified'}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-[13px] font-medium text-[#94A3B8]">No processing match targets discovered.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {validationErrors.candidate_id && (
            <span className="text-[12px] font-semibold text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.candidate_id}
            </span>
          )}
        </div>

        {/* 2. SEARCHABLE JOB DROPDOWN FIELD */}
        <div className="flex flex-col gap-2" ref={jobRef}>
          <label className="text-[13.5px] font-bold text-[#334155] tracking-wide inline-flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#64748B]" /> Target Job Allocation <span className="text-red-500">*</span>
          </label>
          
          <div className="relative">
            <div 
              onClick={() => !submitting && setShowJobDropdown(!showJobDropdown)}
              className={`w-full h-[46px] px-4 bg-[#F8FAFC] border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                validationErrors.job_id ? 'border-red-300 ring-4 ring-red-500/5' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
              } ${showJobDropdown ? 'border-[#2563EB] ring-4 ring-[#2563EB]/5 bg-white' : ''}`}
            >
              <span className={`text-[14px] font-medium ${selectedJob ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                {selectedJob 
                  ? `${selectedJob.title || selectedJob.job_title} ${selectedJob.department ? `(${selectedJob.department})` : ''}` 
                  : "Search and allocate open recruitment role..."
                }
              </span>
              <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${showJobDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Portal Block */}
            {showJobDropdown && (
              <div className="absolute top-[52px] left-0 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2 border-b border-[#E2E8F0] bg-[#F8FAFC] sticky top-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                    <input 
                      type="text"
                      placeholder="Type role title, tracking index code or team..."
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      className="w-full h-[36px] pl-8 pr-3 border border-[#E2E8F0] focus:border-[#2563EB] rounded-lg text-[13px] font-medium outline-none bg-white transition-all text-[#0F172A]"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-[220px] overflow-y-auto p-1.5 flex flex-col gap-0.5">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map(j => {
                      const title = j.title || j.job_title || 'Untitled Opening';
                      return (
                        <button
                          key={j.id}
                          type="button"
                          onClick={() => {
                            setSelectedJob(j);
                            setShowJobDropdown(false);
                            setJobSearch('');
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors flex flex-col gap-0.5 ${
                            selectedJob?.id === j.id ? 'bg-[#2563EB]/5 text-[#2563EB]' : 'text-[#334155] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <span>{title}</span>
                          <span className="text-[11.5px] text-[#64748B]">{j.department || j.team || 'General Operational Department'}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-[13px] font-medium text-[#94A3B8]">No corresponding openings matched.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {validationErrors.job_id && (
            <span className="text-[12px] font-semibold text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.job_id}
            </span>
          )}
        </div>

        {/* 3. EVALUATION NOTES TEXTAREA */}
        <div className="flex flex-col gap-2">
          <label className="text-[13.5px] font-bold text-[#334155] tracking-wide inline-flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#64748B]" /> Structural Evaluation Notes
          </label>
          <textarea
            placeholder="Add structural profile notes, target pipeline vetting details or compensation expectations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={submitting}
            className="w-full min-h-[130px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-white rounded-xl text-[14px] font-medium outline-none transition-all focus:ring-[4px] focus:ring-[#2563EB]/5 text-[#0F172A] resize-y"
          />
        </div>

        {/* Control Interactive Action Strip */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            disabled={submitting}
            onClick={() => navigate('/applications')}
            className="h-[44px] px-5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[14px] font-semibold rounded-xl transition-colors outline-none"
          >
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="h-[44px] px-6 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#2563EB]/70 text-white text-[14px] font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-[#2563EB]/15 outline-none"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Persisting Record...
              </>
            ) : (
              "Initialize Application"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}