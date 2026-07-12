import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Briefcase, Award, MoreVertical, FileText, 
  Download, Eye, Star, Calendar, UserX, Plus
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Status Theme Configurations mapping to matching UI specs
const STATUS_THEMES = {
  Applied: { text: 'Applied', color: '#2563EB', bg: '#DBEAFE' },
  Interview: { text: 'Interview', color: '#F59E0B', bg: '#FEF3C7' },
  Selected: { text: 'Selected', color: '#10B981', bg: '#D1FAE5' },
  Rejected: { text: 'Rejected', color: '#EF4444', bg: '#FEE2E2' }
};

/**
 * Reusable Micro Star Rating Sub-component
 */
function RecruiterRating({ score }) {
  const floorStars = Math.floor(score);
  return (
    <div className="flex items-center gap-1.5 select-none" aria-label={`Recruiter rating: ${score} out of 5 stars`}>
      <div className="flex text-[#F59E0B]">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            className={`h-3.5 w-3.5 ${index < floorStars ? 'fill-current text-[#F59E0B]' : 'text-[#E2E8F0]'}`} 
          />
        ))}
      </div>
      <span className="text-[13px] font-semibold text-[#475569]">{score} / 5</span>
    </div>
  );
}

/**
 * Main Premium Candidate Card Component
 */
export function CandidateCard({ candidate, onAction }) {
  const navigate = useNavigate();

  if (!candidate) return <CandidateCardEmptyState onAdd={() => onAction?.('add-new')} />;

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentTheme = STATUS_THEMES[candidate.status] || STATUS_THEMES.Applied;
  const parsedExperience = parseInt(candidate.experience) || 0;
  // Progress estimation capped at an enterprise standard baseline of 10 years
  const experiencePercentage = Math.min((parsedExperience / 10) * 100, 100);

  // Close the action card dropdown context popover upon click-away detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute initials fallback if direct image link metadata isn't active
  const candidateInitials = candidate.name
    ? candidate.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
    : 'CN';

  // Handle centralized dynamic operations across programmatic route states
  const handleDropdownAction = (action) => {
    setMenuOpen(false);
    if (action === 'view') {
      navigate(`/candidates/${candidate.id}`);
    } else if (action === 'edit') {
      navigate(`/candidates/edit/${candidate.id}`);
    }
    
    // Always trigger downstream events to minimize disruption to existing state architectures
    onAction?.(action, candidate.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      whileHover={{ 
        y: -6, 
        boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.04), 0 10px 10px -5px rgba(15, 23, 42, 0.02)'
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-[20px] p-6 flex flex-col justify-between transition-colors group"
    >
      <div>
        {/* ================= HEADER SECTION ================= */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="relative">
            {candidate.avatarUrl ? (
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.25 }}
                src={candidate.avatarUrl} 
                alt={`${candidate.name} profile layout avatar`}
                className="w-14 h-14 rounded-full object-cover border border-[#E2E8F0]"
              />
            ) : (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.25 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#DBEAFE] text-white flex items-center justify-center font-bold text-[18px] shadow-sm tracking-wide"
              >
                {candidateInitials}
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            {/* Action pill tag */}
            <span 
              style={{ backgroundColor: currentTheme.bg, color: currentTheme.color }}
              className="px-3 py-1 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.color }} />
              {currentTheme.text}
            </span>

            {/* Context Dropdown trigger button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-all outline-none"
              aria-label="Toggle candidate dynamic options layout list"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Action Dropdown Menu List Sheet */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-9 w-[190px] bg-white border border-[#E2E8F0] rounded-[18px] shadow-xl p-1.5 z-30"
                >
                  {[
                    { label: 'View Profile', action: 'view' },
                    { label: 'Edit Candidate', action: 'edit' },
                    { label: 'Download Resume', action: 'download' }
                  ].map((option) => (
                    <button
                      key={option.action}
                      onClick={() => handleDropdownAction(option.action)}
                      className="w-full text-left px-3.5 py-2 text-[14px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-all outline-none"
                    >
                      {option.label}
                    </button>
                  ))}
                  <div className="w-full border-t border-[#E2E8F0] my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); onAction?.('delete', candidate.id); }}
                    className="w-full text-left px-3.5 py-2 text-[14px] font-semibold text-[#EF4444] hover:bg-[#EF4444]/5 rounded-xl transition-all outline-none"
                  >
                    Delete Candidate
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ================= CANDIDATE DATA MODULES ================= */}
        <div className="text-left mb-4">
          <h3 className="text-[22px] font-bold text-[#0F172A] tracking-tight leading-tight truncate mb-3" title={candidate.name}>
            {candidate.name}
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-[15px] font-medium text-[#475569]">
              <Briefcase className="w-4 h-4 text-[#64748B] shrink-0" />
              <span className="truncate">{candidate.position || 'Position Unspecified'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[15px] text-[#64748B]">
              <Mail className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[15px] text-[#64748B]">
              <Phone className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <span className="truncate">{candidate.phone}</span>
            </div>
          </div>
        </div>

        {/* ================= EXPERIENCE INDICATOR SLIDER ================= */}
        <div className="flex flex-col gap-1.5 mb-5 text-left">
          <div className="flex justify-between items-center text-[13px] font-medium text-[#64748B]">
            <span className="flex items-center gap-1"><Award className="w-4 h-4 text-[#2563EB]" /> Total Experience</span>
            <span className="font-bold text-[#0F172A]">{candidate.experience}</span>
          </div>
          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div 
              style={{ width: `${experiencePercentage}%` }}
              className="h-full bg-[#2563EB] rounded-full transition-all duration-500" 
            />
          </div>
        </div>

        {/* ================= SKILLS PILL POOL ================= */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {candidate.skills?.map((skill, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.04 }}
              className="px-2.5 py-0.5 bg-[#DBEAFE] text-[#2563EB] text-[13px] font-medium rounded-md tracking-wide"
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {/* ================= RESUME ROW PREVIEW AND RATING METER ================= */}
        <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl mb-6">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span className="text-[14px] font-medium text-[#334155] truncate" title={candidate.resumeName || 'Resume.pdf'}>
              {candidate.resumeName || 'Resume.pdf'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onAction?.('view-resume', candidate.id)}
              className="p-1 text-[#64748B] hover:text-[#2563EB] hover:bg-[#DBEAFE]/40 rounded-md transition-colors outline-none"
              title="Preview document asset"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onAction?.('download-resume', candidate.id)}
              className="p-1 text-[#64748B] hover:text-[#2563EB] hover:bg-[#DBEAFE]/40 rounded-md transition-colors outline-none"
              title="Download file directly"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTROL BLOCK INTERFACE REQUISITIONS ================= */}
      <div className="flex items-center justify-between gap-3 mt-auto">
        <RecruiterRating score={candidate.rating || 4.0} />
        
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              navigate(`/interviews/create/${candidate.id}`);
              onAction?.('schedule', candidate.id);
            }}
            className="h-[38px] px-3.5 bg-[#2563EB] text-white text-[14px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#2563EB]/10 outline-none"
          >
            <Calendar className="w-3.5 h-3.5" /> Schedule
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/candidates/${candidate.id}`)}
            className="h-[38px] px-3.5 bg-white border border-[#E2E8F0] hover:border-[#2563EB] text-[#475569] hover:text-[#2563EB] text-[14px] font-semibold rounded-xl transition-colors outline-none"
          >
            Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Empty State Alternate Grid Layout View Box Placeholder
 */
export function CandidateCardEmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-12 bg-white border border-dashed border-[#E2E8F0] rounded-[24px] flex flex-col items-center justify-center text-center min-h-[340px]"
    >
      <div className="w-14 h-14 bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-[#64748B] mb-4 shadow-inner">
        <UserX className="w-6 h-6" />
      </div>
      <h3 className="text-[18px] font-bold text-[#0F172A] tracking-tight mb-1">No Candidate Found</h3>
      <p className="text-[14px] text-[#64748B] max-w-xs mb-5 leading-relaxed">
        We couldn't locate any candidate profiles matching the active filters or active pipeline tracking configurations.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAdd}
        className="h-[42px] px-4 bg-[#2563EB] text-white text-[14px] font-semibold rounded-xl shadow-sm hover:bg-[#1D4ED8] transition-colors inline-flex items-center gap-2 outline-none"
      >
        <Plus className="w-4 h-4" /> Add Candidate
      </motion.button>
    </motion.div>
  );
}