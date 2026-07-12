import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, FileUp, Search, SlidersHorizontal, LayoutGrid, 
  List, ArrowUpDown, ChevronLeft, ChevronRight, TrendingUp, 
  Calendar, CheckCircle
} from 'lucide-react';
import { CandidateCard, CandidateCardEmptyState } from '../components/CandidateCard';
import API from "../api/axios";

export default function Candidates() {
  const navigate = useNavigate();

  // Core UI Data States
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  
  // Search & Filters Framework state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination Parameters
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const response = await API.get("/candidates");

      const formattedCandidates = (response.data.candidates || []).map(c => ({
        ...c,
        name: c.full_name,
        position: c.position_applied,
        resumeName: c.resume_link
          ? c.resume_link.split("/").pop()
          : "No Resume",
        avatarUrl: null,
        rating: 4.0,
        skills: c.skills || []
      }));

      setCandidates(formattedCandidates);

    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Filter & Search Matrix Resolution Pipeline
  const filteredCandidates = candidates.filter(candidate => {
    const name = candidate.name || '';
    const email = candidate.email || '';
    const position = candidate.position || '';
    const skills = Array.isArray(candidate.skills) ? candidate.skills : [];

    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    
    let matchesExperience = true;
    const years = parseInt(candidate.experience) || 0;
    if (experienceFilter === 'junior') matchesExperience = years <= 2;
    if (experienceFilter === 'mid') matchesExperience = years > 2 && years <= 5;
    if (experienceFilter === 'senior') matchesExperience = years > 5;

    return matchesSearch && matchesStatus && matchesExperience;
  }).sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'experience') return (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0);
    return (b.id || 0) - (a.id || 0); // Default newest
  });

  // Pagination Math Bound Calculation
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Orchestrate operational CRUD target behaviors
  const handleAction = async (action, id) => {
    if (action === 'delete') {
      try {
        await API.delete(`/candidates/${id}`);
        fetchCandidates();
      } catch (error) {
        console.error(`Failed to delete candidate context payload record ID: ${id}`, error);
      }
    } else if (action === 'view') {
      navigate(`/candidates/${id}`);
    } else if (action === 'edit') {
      navigate(`/candidates/edit/${id}`);
    } else if (action === 'schedule') {
      navigate(`/interviews/create/${id}`);
    } else if (action === 'add-new') {
      navigate('/candidates/new');
    } else if (action === 'download' || action === 'download-resume' || action === 'view-resume') {
      // Find matching object reference from internal memory allocation mapping states
      const targetCandidate = candidates.find(c => c.id === id);
      if (targetCandidate && targetCandidate.resume_link && targetCandidate.resume_link !== "No Resume") {
        window.open(targetCandidate.resume_link, '_blank');
      } else {
        alert("No resume available.");
      }
    } else {
      console.log(`Action contextual call: [${action}] mapping to target parameter user sequence ID: ${id}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-8 w-full max-w-full text-left"
    >
      {/* ========================================================== */}
      {/* PAGE TITLE BAR SECTION & CONTROLS                          */}
      {/* ========================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] sm:text-[34px] font-bold text-[#0F172A] tracking-tight leading-none mb-2">
            Candidates
          </h1>
          <p className="text-[14px] sm:text-[15px] font-medium text-[#64748B]">
            Manage candidate profiles, review applications, and schedule pipeline interviews.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            className="h-[44px] px-4 border border-[#E2E8F0] hover:border-[#2563EB] bg-white text-[#475569] hover:text-[#2563EB] text-[15px] font-semibold rounded-xl transition-colors inline-flex items-center gap-2 outline-none"
          >
            <FileUp className="w-4 h-4" /> Export
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('add-new')}
            className="h-[44px] px-4 bg-[#2563EB] text-white text-[15px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all flex items-center gap-2 shadow-sm shadow-[#2563EB]/15 outline-none"
          >
            <UserPlus className="w-4 h-4" /> Add Candidate
          </motion.button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SYSTEM PIPELINE SUMMARY KPI STATS GENERATOR PANELS        */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {[
          { label: 'Total Candidates', value: candidates.length, trend: '+14%', icon: Users, color: '#2563EB', bg: 'rgba(37,99,235,0.06)' },
          { label: 'New This Week', value: `${candidates.filter(c => (c.id || 0) > 3).length} profiles`, trend: '+4%', icon: TrendingUp, color: '#A855F7', bg: 'rgba(168,85,247,0.06)' },
          { label: 'Interviews Booked', value: `${candidates.filter(c => c.status === 'Interview').length} active`, trend: '+22%', icon: Calendar, color: '#F59E0B', bg: 'rgba(245,158,11,0.06)' },
          { label: 'Selected Met', value: `${candidates.filter(c => c.status === 'Selected').length} offers`, trend: 'Steady', icon: CheckCircle, color: '#10B981', bg: 'rgba(16,185,129,0.06)' }
        ].map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-sm flex items-center justify-between transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider">{card.label}</span>
                <span className="text-[24px] font-bold text-[#0F172A] tracking-tight">{card.value}</span>
                <span className="text-[12px] font-semibold text-[#22C55E] flex items-center gap-1">
                  {card.trend} <span className="text-[#94A3B8] font-normal">vs last month</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: card.bg, color: card.color }}>
                <IconComponent className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ========================================================== */}
      {/* TOOLBAR FILTER CRITERIA INTERFACE FRAME WORK              */}
      {/* ========================================================== */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-[20px] shadow-sm flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search candidates by name, email, position, or skills..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full h-[44px] pl-10 pr-4 bg-[#F8FAFC] border border-transparent focus:border-[#2563EB] focus:bg-white rounded-full text-[14px] font-medium outline-none transition-all focus:ring-[4px] focus:ring-[#2563EB]/5 text-[#0F172A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#64748B]" />
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-[38px] px-3 border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#475569] bg-white outline-none cursor-pointer hover:border-[#64748B]"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <select 
            value={experienceFilter} 
            onChange={(e) => { setExperienceFilter(e.target.value); setCurrentPage(1); }}
            className="h-[38px] px-3 border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#475569] bg-white outline-none cursor-pointer hover:border-[#64748B]"
          >
            <option value="All">All Experience Tracks</option>
            <option value="junior">Junior (≤ 2 yrs)</option>
            <option value="mid">Mid-Level (2-5 yrs)</option>
            <option value="senior">Senior (&gt; 5 yrs)</option>
          </select>

          <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-3">
            <ArrowUpDown className="w-4 h-4 text-[#64748B]" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="h-[38px] px-3 border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#475569] bg-white outline-none cursor-pointer hover:border-[#64748B]"
            >
              <option value="newest">Sort: Newest</option>
              <option value="name">Sort: Alphabetical</option>
              <option value="experience">Sort: Experience</option>
            </select>
          </div>

          <div className="flex items-center border border-[#E2E8F0] rounded-xl p-0.5 bg-[#F8FAFC]">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-[#64748B]'}`}
              title="Grid Visual Board"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-[#64748B]'}`}
              title="Tabular Structured Sheet"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SHIMMERING SKELETON LOADER STATE ROUTINE MATRIX           */}
      {/* ========================================================== */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="w-full bg-white border border-[#E2E8F0] rounded-[20px] p-6 flex flex-col gap-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl" />
                <div className="w-20 h-6 bg-[#F1F5F9] rounded-full" />
              </div>
              <div className="h-5 bg-[#F1F5F9] rounded-md w-3/4 mt-2" />
              <div className="h-4 bg-[#F1F5F9] rounded-md w-1/2" />
              <div className="w-full h-2 bg-[#F1F5F9] rounded-full mt-4" />
              <div className="flex gap-2 mt-2">
                <div className="w-16 h-6 bg-[#F1F5F9] rounded" />
                <div className="w-16 h-6 bg-[#F1F5F9] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedCandidates.length === 0 ? (
<CandidateCardEmptyState
  onAdd={() => navigate('/candidates/new')}
/>      ) : viewMode === 'grid' ? (
        /* GRID INTERFACE RENDER COMPONENT SCHEME */
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          <AnimatePresence mode="popLayout">
            {paginatedCandidates.map(candidate => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                onAction={handleAction} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* TABLE STRUCTURE SHEETS CONFIGURATION */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Profile Name</th>
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Position Applied</th>
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Experience Track</th>
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Status State</th>
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Skills</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCandidates.map((c) => (
                  <tr key={c.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/40 transition-colors">
                    <td className="p-4 font-bold text-[#0F172A] text-[15px]">{c.name}</td>
                    <td className="p-4 font-medium text-[#475569] text-[14px]">{c.position}</td>
                    <td className="p-4 text-[#64748B] text-[14px]">{c.experience}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-[#DBEAFE] text-[#2563EB] rounded-full text-[12px] font-bold">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5">
                        {Array.isArray(c.skills) && c.skills.slice(0, 2).map(sk => (
                          <span key={sk} className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-[12px] rounded font-medium">{sk}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ========================================================== */}
      {/* FRAMEWORK PAGINATION INTERFACE SELECTION RAIL              */}
      {/* ========================================================== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-6 mt-4">
          <span className="text-[14px] font-medium text-[#64748B]">
            Showing <span className="font-bold text-[#0F172A]">{paginatedCandidates.length}</span> of <span className="font-bold text-[#0F172A]">{filteredCandidates.length}</span> results
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 border border-[#E2E8F0] bg-white text-[#475569] rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-[#F8FAFC] transition-colors outline-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-[14px] font-bold transition-all outline-none ${
                  currentPage === i + 1 
                    ? 'bg-[#2563EB] text-white shadow-sm' 
                    : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 border border-[#E2E8F0] bg-white text-[#475569] rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-[#F8FAFC] transition-colors outline-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}