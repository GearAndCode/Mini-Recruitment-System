import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Briefcase, DollarSign, Award, Calendar, MoreVertical, 
  Eye, Settings, Copy, Power, Trash2, Users, ArrowUpRight, Plus, AlertCircle
} from 'lucide-react';

// Status styling matrices mapping to theme specs
const STATUS_THEMES = {
  'Open': { text: 'Open', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
  'Closed': { text: 'Closed', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)' },
  'Urgent Hiring': { text: 'Urgent', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  'Paused': { text: 'Paused', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)' }
};

/**
 * 1. Primary Component: Reusable Job Requisition Card
 */
export function JobCard({ job, onAction }) {
  if (!job) return <JobCardEmptyState onCreate={() => onAction?.('create-new')} />;

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentTheme = STATUS_THEMES[job.status] || STATUS_THEMES['Open'];
  const totalSlots = job.targetSlots || 100;
  const progressPercent = Math.min(((job.applicationsCount || 0) / totalSlots) * 100, 100);

  // Close context sheet upon detecting click boundaries out of scope
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      className="w-full bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-[20px] p-6 flex flex-col justify-between transition-colors group relative"
    >
      <div>
        {/* ================= CARD HEADER ================= */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="text-left min-w-0">
            <h3 className="text-[22px] font-bold text-[#0F172A] tracking-tight leading-snug truncate group-hover:text-[#2563EB] transition-colors" title={job.title}>
              {job.title}
            </h3>
            <span className="text-[15px] font-medium text-[#64748B] block mt-0.5">{job.department || 'General Operations'}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative" ref={dropdownRef}>
            {/* Status Indicator Badge */}
            <span 
              style={{ backgroundColor: currentTheme.bg, color: currentTheme.color }}
              className="px-2.5 py-1 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.color }} />
              {currentTheme.text}
            </span>

            {/* Action Menu Anchor */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-all outline-none"
              aria-label="Toggle job specification dropdown menu"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Context Action Floating Overlay */}
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
                    { label: 'View Details', action: 'view', icon: Eye },
                    { label: 'Edit Requisition', action: 'edit', icon: Settings },
                    { label: 'Duplicate Entry', action: 'duplicate', icon: Copy },
                    { label: 'Close Opening', action: 'close', icon: Power }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.action}
                        onClick={() => { setMenuOpen(false); onAction?.(item.action, job.id); }}
                        className="w-full text-left px-3 py-2 text-[14px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl flex items-center gap-2.5 transition-all outline-none"
                      >
                        <Icon className="w-4 h-4 text-[#64748B]" /> {item.label}
                      </button>
                    );
                  })}
                  <div className="w-full border-t border-[#E2E8F0] my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); onAction?.('delete', job.id); }}
                    className="w-full text-left px-3 py-2 text-[14px] font-semibold text-[#EF4444] hover:bg-[#EF4444]/5 rounded-xl flex items-center gap-2.5 transition-all outline-none"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Job
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ================= METRIC STRUCTURAL REQUISITIONS ================= */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-5 text-left border-b border-[#E2E8F0]/60 pb-4">
          <div className="flex items-center gap-2 text-[15px] text-[#475569] font-medium min-w-0">
            <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[15px] text-[#475569] font-medium min-w-0">
            <Briefcase className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">{job.type}</span>
          </div>
          <div className="flex items-center gap-2 text-[15px] text-[#475569] font-medium min-w-0">
            <DollarSign className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-[15px] text-[#475569] font-medium min-w-0">
            <Award className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">{job.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-[14px] text-[#64748B] col-span-2 mt-0.5">
            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span>Posted on {job.postedDate || 'Recent'}</span>
          </div>
        </div>

        {/* ================= HIRING PIPELINE VELOCITY METER ================= */}
        <div className="flex flex-col gap-1.5 mb-5 text-left">
          <div className="flex justify-between items-center text-[13px] font-medium text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">Applications Volume</span>
            <span><strong className="text-[#2563EB] font-bold">{job.applicationsCount || 0}</strong> / {totalSlots}</span>
          </div>
          <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-[#2563EB] rounded-full" 
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-[12px] font-semibold text-[#64748B] px-0.5">
            <span>Interviewed: {job.interviewedCount || 0}</span>
            <span>Selected: {job.selectedCount || 0}</span>
          </div>
        </div>

        {/* ================= SKILL DEPLOYMENT PILL CONTAINER ================= */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.skills?.slice(0, 5).map((skill, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.04 }}
              className="px-2.5 py-0.5 bg-[#DBEAFE] text-[#2563EB] text-[13px] font-medium rounded-md tracking-wide"
            >
              {skill}
            </motion.span>
          ))}
          {job.skills?.length > 5 && (
            <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-[12px] font-bold rounded-md">
              +{job.skills.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* ================= FOOTER OPERATIONAL LINK ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-[#E2E8F0]/60">
        {/* Overlapping Applicant Avatar Array Display */}
        <div className="flex items-center">
          <div className="flex -space-x-2.5 overflow-hidden">
            {(job.sampleAvatars || ['AD', 'BC', 'JF', 'KH']).map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.15, zIndex: 10 }}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563EB]/80 to-[#DBEAFE] text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer shrink-0"
              >
                {item}
              </motion.div>
            ))}
          </div>
          {job.totalApplicantsOverThreshold > 0 && (
            <span className="text-[13px] font-bold text-[#64748B] ml-2 select-none">
              +{job.totalApplicantsOverThreshold} tracking
            </span>
          )}
        </div>

        {/* Primary Interactive Trigger Set */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction?.('manage', job.id)}
            className="flex-1 sm:flex-none h-[38px] px-3.5 bg-white border border-[#E2E8F0] hover:border-[#2563EB] text-[#475569] hover:text-[#2563EB] text-[14px] font-semibold rounded-xl transition-all outline-none whitespace-nowrap"
          >
            Manage Apps
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction?.('view', job.id)}
            className="flex-1 sm:flex-none h-[38px] px-3.5 bg-[#2563EB] text-white text-[14px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-1 shadow-sm shadow-[#2563EB]/10 outline-none"
          >
            Details <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 2. Secondary Component: Requisition Vector Fallback Frame
 */
export function JobCardEmptyState({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-12 bg-white border border-dashed border-[#E2E8F0] rounded-[24px] flex flex-col items-center justify-center text-center min-h-[360px]"
    >
      <div className="w-14 h-14 bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-[#64748B] mb-4 shadow-inner">
        <AlertCircle className="w-6 h-6 text-[#94A3B8]" />
      </div>
      <h3 className="text-[18px] font-bold text-[#0F172A] tracking-tight mb-1">No Jobs Available</h3>
      <p className="text-[14px] text-[#64748B] max-w-xs mb-5 leading-relaxed">
        There are no open structural workspace definitions listed for recruitment tracking inside this platform context.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreate}
        className="h-[42px] px-4 bg-[#2563EB] text-white text-[14px] font-semibold rounded-xl shadow-sm hover:bg-[#1D4ED8] transition-colors inline-flex items-center gap-2 outline-none"
      >
        <Plus className="w-4 h-4" /> Create Job Opening
      </motion.button>
    </motion.div>
  );
}