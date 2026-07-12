import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Briefcase, Calendar, Award, MoreVertical, FileText, 
  Eye, Download, Video, User, Star, ChevronDown, ChevronUp, AlertCircle, Plus 
} from 'lucide-react';

// Stage flow pipeline mapping constants
const PIPELINE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Selected'];

const STATUS_THEMES = {
  Applied: { text: 'Applied', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  Interview: { text: 'Interview', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  Selected: { text: 'Selected', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
  Rejected: { text: 'Rejected', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

export function ApplicationCard({ application, onAction }) {
  if (!application) return <ApplicationCardEmptyState onCreate={() => onAction?.('create-new')} />;

  const [menuOpen, setMenuOpen] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const dropdownRef = useRef(null);

  const currentTheme = STATUS_THEMES[application.status] || STATUS_THEMES.Applied;
  const currentStageIndex = PIPELINE_STAGES.indexOf(application.currentStage);

  // Close dropdown context menu on outer click bounds entry
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = application.name
    ? application.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'APP';

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
        {/* ========================================================== */}
        {/* CARD TOP MAIN ROUTINE HEADER CONTROL REGION                */}
        {/* ========================================================== */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5 min-w-0 text-left">
            {application.avatarUrl ? (
              <img 
                src={application.avatarUrl} 
                alt={`${application.name} workspace layout profile thumbnail`} 
                className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0] shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#DBEAFE] text-white flex items-center justify-center font-bold text-[15px] shrink-0 shadow-sm">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-[20px] font-bold text-[#0F172A] tracking-tight truncate leading-tight mb-0.5" title={application.name}>
                {application.name}
              </h3>
              <span className="text-[12px] font-bold text-[#64748B] tracking-wider uppercase block">{application.appId || '#APP-0000'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <span 
              style={{ backgroundColor: currentTheme.bg, color: currentTheme.color }}
              className="px-2.5 py-1 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.color }} />
              {currentTheme.text}
            </span>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-all outline-none"
              aria-label="Application routing contextual controls"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Context action operations template wrapper */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-9 w-[200px] bg-white border border-[#E2E8F0] rounded-[18px] shadow-xl p-1.5 z-30 text-left"
                >
                  {[
                    { label: 'View Application', action: 'view' },
                    { label: 'Schedule Interview', action: 'schedule' },
                    { label: 'Update Status Stage', action: 'update-status' },
                    { label: 'Download CV File', action: 'download-resume' }
                  ].map((item) => (
                    <button
                      key={item.action}
                      onClick={() => { setMenuOpen(false); onAction?.(item.action, application.id); }}
                      className="w-full px-3 py-2 text-[14px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-all block outline-none"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="w-full border-t border-[#E2E8F0] my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); onAction?.('delete', application.id); }}
                    className="w-full text-left px-3 py-2 text-[14px] font-semibold text-[#EF4444] hover:bg-[#EF4444]/5 rounded-xl transition-all block outline-none"
                  >
                    Delete Record
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CORE DATA ATTRIBUTE FIELDS REGION                         */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-left border-b border-[#E2E8F0]/60 pb-4 mb-4">
          <div className="flex items-center gap-2.5 text-[14px] text-[#475569] font-medium min-w-0">
            <Briefcase className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">{application.position}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[14px] text-[#475569] font-medium min-w-0">
            <Award className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">{application.experience || 'N/A Exp'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[14px] text-[#64748B] min-w-0">
            <Mail className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">{application.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[14px] text-[#64748B] min-w-0">
            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">Applied: {application.date || 'Recent'}</span>
          </div>
        </div>

        {/* ========================================================== */}
        {/* RECRUITMENT PIPELINE TIMELINE PROGRESS ROUTINE RAIL       */}
        {/* ========================================================== */}
        <div className="mb-5 text-left">
          <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider block mb-3">Current Pipeline Gate</span>
          <div className="flex items-center justify-between relative w-full overflow-x-auto scrollbar-none py-1">
            {PIPELINE_STAGES.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              return (
                <div key={stage} className="flex flex-col items-center flex-1 min-w-[54px] relative z-10">
                  <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCurrent ? 'bg-[#2563EB] border-[#2563EB] text-white ring-4 ring-[#2563EB]/10' :
                      isCompleted ? 'bg-[#DBEAFE] border-[#2563EB] text-[#2563EB]' : 'bg-white border-[#E2E8F0] text-[#94A3B8]'
                    }`}
                  >
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  </div>
                  <span className={`text-[12px] font-semibold mt-1.5 transition-colors whitespace-nowrap ${isCurrent ? 'text-[#2563EB] font-bold' : 'text-[#64748B]'}`}>
                    {stage}
                  </span>
                </div>
              );
            })}
            {/* Structural background connective tracking line axis */}
            <div className="absolute top-[11px] left-0 w-full h-[2px] bg-[#F1F5F9] z-0" />
            <div 
              className="absolute top-[11px] left-0 h-[2px] bg-[#2563EB] z-0 transition-all duration-500" 
              style={{ width: `${(currentStageIndex / (PIPELINE_STAGES.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* ========================================================== */}
        {/* CONDITIONAL INTERVIEW ASSIGNMENT META BLOCK               */}
        {/* ========================================================== */}
        {application.interview && (
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-left mb-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[13px] font-bold text-[#0F172A] block leading-tight">Next Scheduled Step Loop</span>
              <p className="text-[12px] text-[#64748B] mt-0.5 font-medium truncate">
                {application.interview.date} @ {application.interview.time} • Modality: {application.interview.type}
              </p>
              <span className="text-[12px] text-[#475569] font-medium mt-1 block truncate">
                Interviewer: <strong className="font-semibold text-[#0F172A]">{application.interview.panelist}</strong>
              </span>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* EVALUATOR OPERATIONAL NOTES FEEDBACK REGION                */}
        {/* ========================================================== */}
        {application.notes && (
          <div className="p-3 bg-[#F1F5F9]/60 rounded-xl text-left mb-4 text-[13px] text-[#475569] font-medium">
            <p className={notesExpanded ? 'line-clamp-none' : 'line-clamp-2'}>
              <strong className="text-[#0F172A] font-semibold">Recruiter Log:</strong> {application.notes}
            </p>
            {application.notes.length > 90 && (
              <button 
                onClick={() => setNotesExpanded(!notesExpanded)}
                className="text-[#2563EB] text-[12px] font-bold mt-1 inline-flex items-center gap-0.5 outline-none hover:underline"
              >
                {notesExpanded ? <>Collapse <ChevronUp className="w-3 h-3" /></> : <>Read Full Log <ChevronDown className="w-3 h-3" /></>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* CARD INTERACTIVE RUNTIME COMPONENT ACTION FOOTER REGION   */}
      {/* ========================================================== */}
      <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-[#E2E8F0]/60">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, idx) => (
            <Star 
              key={idx} 
              className={`w-3.5 h-3.5 ${idx < Math.floor(application.rating || 4) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E2E8F0]'}`} 
            />
          ))}
          <span className="text-[12px] font-bold text-[#475569] ml-1">{application.rating || '4.0'}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onAction?.('view', application.id)}
            className="h-[36px] px-3 border border-[#E2E8F0] hover:border-[#2563EB] text-[#475569] hover:text-[#2563EB] text-[13px] font-semibold rounded-xl transition-colors bg-white outline-none"
          >
            Details
          </button>
          <button
            onClick={() => onAction?.('update-status', application.id)}
            className="h-[36px] px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold rounded-xl transition-colors shadow-sm outline-none"
          >
            Advance Stage
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 2. Secondary Boundary View Component Fallback Frame
 */
export function ApplicationCardEmptyState({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-12 bg-white border border-dashed border-[#E2E8F0] rounded-[24px] flex flex-col items-center justify-center text-center min-h-[350px]"
    >
      <div className="w-14 h-14 bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-[#64748B] mb-4">
        <AlertCircle className="w-6 h-6 text-[#94A3B8]" />
      </div>
      <h3 className="text-[18px] font-bold text-[#0F172A] tracking-tight mb-1">No Applications Found</h3>
      <p className="text-[14px] text-[#64748B] max-w-xs mb-5 leading-relaxed">
        There are no structural candidate processing application tickets tied to the current lifecycle parameters.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreate}
        className="h-[42px] px-4 bg-[#2563EB] text-white text-[14px] font-semibold rounded-xl shadow-sm hover:bg-[#1D4ED8] transition-colors inline-flex items-center gap-2 outline-none"
      >
        <Plus className="w-4 h-4" /> Create Ticket Application
      </motion.button>
    </motion.div>
  );
}