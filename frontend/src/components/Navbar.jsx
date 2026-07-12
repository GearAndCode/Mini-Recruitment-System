import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Briefcase, FileText, Calendar, Bell, Search, ChevronDown, 
  Menu, X, LayoutDashboard, LogOut, ArrowUpRight, Plus, 
  CheckCircle2, AlertCircle, Clock, FileSpreadsheet, Sparkles
} from 'lucide-react';

// Design Token Matrix constants mapping exactly to your design system
const STATS_CARDS_DATA = [
  { id: 'candidates', title: 'Total Candidates', value: 245, icon: Users, color: '#2563EB', bgColor: 'rgba(37, 99, 235, 0.08)', growth: '+12.5%' },
  { id: 'jobs', title: 'Open Jobs', value: 18, icon: Briefcase, color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.08)', growth: '+4.2%' },
  { id: 'applications', title: 'Applications', value: 530, icon: FileText, color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.08)', growth: '+24.1%' },
  { id: 'interviews', title: 'Interviews Scheduled', value: 42, icon: Calendar, color: '#A855F7', bgColor: 'rgba(168, 85, 247, 0.08)', growth: '+8.6%' }
];

const RECENT_CANDIDATES = [
  { id: 1, name: 'Courtney Henry', position: 'Senior Full Stack Engineer', experience: '6 Yrs', status: 'Interview', initial: 'CH' },
  { id: 2, name: 'Albert Flores', position: 'Lead DevOps Specialist', experience: '8 Yrs', status: 'Selected', initial: 'AF' },
  { id: 3, name: 'Jenny Wilson', position: 'Product Product Manager', experience: '4 Yrs', status: 'Applied', initial: 'JW' },
  { id: 4, name: 'Bessie Cooper', position: 'Junior Frontend Developer', experience: '1 Yr', status: 'Rejected', initial: 'BC' },
  { id: 5, name: 'Jerome Bell', position: 'Data Science Architect', experience: '10 Yrs', status: 'Interview', initial: 'JB' }
];

const RECENT_JOBS = [
  { id: 1, title: 'Senior Backend Engineer (Node.js)', dept: 'Engineering', loc: 'Remote', salary: '$140k - $160k', status: 'Open' },
  { id: 2, title: 'UI/UX Lead Designer', dept: 'Product Design', loc: 'New York, NY', salary: '$130k - $150k', status: 'Open' },
  { id: 3, title: 'Staff Technical Program Manager', dept: 'Operations', loc: 'Hybrid / SF', salary: '$180k - $210k', status: 'Closed' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFormattedDate = "Friday, July 10, 2026";

  const handleSignOutAction = () => {
    // Purge tokens out of storage context
    // localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans text-[#334155] flex antialiased selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      
      {/* ========================================================== */}
      {/* DESKTOP SIDEBAR NAVIGATION (Hidden below viewports md)     */}
      {/* ========================================================== */}
      <aside className="hidden md:flex w-[260px] bg-white border-r border-[#E2E8F0] fixed h-full z-30 flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          {/* System Logo Node */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-md shadow-[#2563EB]/15 text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#0F172A] tracking-tight leading-none mb-1">Vertex HR</span>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider leading-none">Internal Platform</span>
            </div>
          </div>

          {/* Navigation Matrix Links */}
          <nav className="flex flex-col gap-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 h-[44px] rounded-xl bg-[#2563EB] text-white font-medium text-[14px] shadow-sm transition-all duration-200">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard Overview
            </Link>
            <Link to="/candidates" className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium text-[14px] transition-all duration-200">
              <Users className="h-4 w-4" />
              Candidates Tracking
            </Link>
            <Link to="/jobs" className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium text-[14px] transition-all duration-200">
              <Briefcase className="h-4 w-4" />
              Job Postings
            </Link>
            <Link to="/applications" className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium text-[14px] transition-all duration-200">
              <FileText className="h-4 w-4" />
              Applications Flow
            </Link>
          </nav>
        </div>

        {/* Action Trigger Block: Sign Out */}
        <button 
          onClick={handleSignOutAction}
          className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-[#EF4444] hover:bg-[#EF4444]/5 font-medium text-[14px] transition-all duration-200 text-left outline-none"
        >
          <LogOut className="h-4 w-4" />
          Terminate Session
        </button>
      </aside>

      {/* ========================================================== */}
      {/* MOBILE HEADER BAR & COLLAPSIBLE MOBILE MENU                */}
      {/* ========================================================== */}
      <div className="md:hidden w-full h-[64px] border-b border-[#E2E8F0] bg-white px-4 flex items-center justify-between fixed top-0 left-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
            <Briefcase className="h-3.5 w-3.5" />
          </div>
          <span className="text-[15px] font-bold text-[#0F172A]">Vertex HR</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-9 w-9 border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#334155] outline-none"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Collapsible Mobile Navigation Overlay Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-[64px] left-0 w-full bg-white border-b border-[#E2E8F0] z-30 p-4 flex flex-col gap-4 shadow-xl"
          >
            <div className="flex flex-col gap-1">
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 h-[44px] rounded-xl bg-[#2563EB] text-white font-medium text-[14px]">
                <LayoutDashboard className="h-4 w-4" /> Dashboard Overview
              </Link>
              <Link to="/candidates" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-[#64748B] font-medium text-[14px]">
                <Users className="h-4 w-4" /> Candidates Tracking
              </Link>
              <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-[#64748B] font-medium text-[14px]">
                <Briefcase className="h-4 w-4" /> Job Postings
              </Link>
              <Link to="/applications" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-[#64748B] font-medium text-[14px]">
                <FileText className="h-4 w-4" /> Applications Flow
              </Link>
            </div>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); handleSignOutAction(); }}
              className="flex items-center gap-3 px-4 h-[44px] border border-[#E2E8F0] rounded-xl text-[#EF4444] font-medium text-[14px]"
            >
              <LogOut className="h-4 w-4" /> Terminate Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* MAIN MAIN APP CONTENT WORKSPACE PLANE                      */}
      {/* ========================================================== */}
      <div className="flex-1 md:pl-[260px] pt-[64px] md:pt-0 flex flex-col min-w-0">
        
        {/* Sticky Global Topbar Navigation Panel */}
        <header className="h-[70px] bg-white border-b border-[#E2E8F0] hidden md:flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h1 className="text-[16px] font-semibold text-[#0F172A] m-0 leading-none mb-1">Dashboard Overview</h1>
            <p className="text-[12px] font-medium text-[#64748B] m-0 leading-none">Home / Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Context Global Search Element Container */}
            <div className="relative w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <input 
                type="text" 
                placeholder="Search matching indexes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[38px] pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/5 transition-all"
              />
            </div>

            {/* Notification Bell Trigger Node with Interactive Dropdown mapping */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="h-[38px] w-[38px] border border-[#E2E8F0] rounded-xl flex items-center justify-center relative hover:bg-[#F8FAFC] transition-colors outline-none"
              >
                <Bell className="h-4 w-4 text-[#475569]" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2563EB]" />
              </button>
              
              <AnimatePresence>
                {isNotificationDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-[320px] bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 z-50 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                      <span className="text-[13px] font-bold text-[#0F172A]">Notifications Logs</span>
                      <span className="text-[11px] font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded-full">2 New</span>
                    </div>
                    <div className="flex flex-col gap-2.5 max-h-[240px] overflow-y-auto">
                      <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                        <div className="h-2 w-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[12px] font-semibold text-[#0F172A] m-0">Courtney Henry moved stage</p>
                          <p className="text-[11px] text-[#64748B] m-0">Advanced to Technical Assessment Interview.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                        <div className="h-2 w-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[12px] font-semibold text-[#0F172A] m-0">New application entry received</p>
                          <p className="text-[11px] text-[#64748B] m-0">Albert Flores submitted profile for Lead DevOps role.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Menu Context */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 py-1 pr-1 border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors outline-none"
              >
                <div className="h-7 w-7 rounded-lg bg-[#0F172A] flex items-center justify-center font-bold text-white text-[12px]">
                  AD
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[12px] font-bold text-[#0F172A] leading-none mb-0.5">Admin Account</span>
                  <span className="text-[10px] font-medium text-[#64748B] leading-none">Super Administrator</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#64748B] mr-1" />
              </button>
            </div>
          </div>
        </header>

        {/* Inner Scrolling Workspace Layer */}
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-[1600px] w-full mx-auto">
          
          {/* Welcome Title Segment */}
          <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-[22px] md:text-[24px] font-bold text-[#0F172A] tracking-tight mb-1">
                Welcome back, Admin 👋
              </h2>
              <p className="text-[14px] text-[#64748B] font-normal">
                Here is an overview of today's recruitment activities and pipeline processing metrics.
              </p>
            </div>
            <div className="px-4 h-[38px] bg-white border border-[#E2E8F0] rounded-xl flex items-center gap-2 text-[13px] font-semibold text-[#0F172A] w-max shadow-sm">
              <Calendar className="h-4 w-4 text-[#64748B]" />
              {currentFormattedDate}
            </div>
          </section>

          {/* ========================================================== */}
          {/* STATS OVERVIEW CARDS (KPI PLATFORMS GRID)                  */}
          {/* ========================================================== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS_CARDS_DATA.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.div 
                  key={card.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)' }}
                  className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 flex flex-col justify-between relative overflow-hidden shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[14px] font-medium text-[#64748B]">{card.title}</span>
                    <div 
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: card.bgColor, color: card.color }}
                    >
                      <IconComponent className="h-[18px] w-[18px]" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[28px] font-bold text-[#0F172A] tracking-tight">{card.value}</span>
                    <span className="text-[12px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      {card.growth}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] font-normal mt-2">Evaluation run tracking vs previous calendar month</p>
                </motion.div>
              );
            })}
          </section>

          {/* ========================================================== */}
          {/* ANALYTICS CHARTS / WORKFLOW PIPELINE DEMO CONTAINER       */}
          {/* ========================================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Mock Analytics Area Chart Placeholder */}
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 lg:col-span-2 flex flex-col justify-between min-h-[340px] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight m-0">Recruitment Analytics Flow</h3>
                  <p className="text-[12px] text-[#64748B] m-0">Metrics capturing incoming application load over the last six months</p>
                </div>
                <span className="text-[12px] font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-xl">Historical Trend</span>
              </div>
              
              {/* Clean abstract CSS/SVG area metric line chart vector mock */}
              <div className="h-[200px] w-full bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] relative overflow-hidden flex items-end">
                <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                  {/* Area Area Curve */}
                  <path d="M 0 160 Q 120 120 240 140 T 480 70 T 600 50 L 600 200 L 0 200 Z" fill="url(#chartGlow)" />
                  {/* Core Vector Stroke Line */}
                  <path d="M 0 160 Q 120 120 240 140 T 480 70 T 600 50" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                </svg>
                <div className="w-full flex justify-between px-6 pb-2 text-[11px] font-semibold text-[#94A3B8] relative z-10">
                  <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul (2026)</span>
                </div>
              </div>
            </div>

            {/* Quick Action Control Node Module Block */}
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight m-0 mb-1">Quick Configuration Panel</h3>
                <p className="text-[12px] text-[#64748B] m-0 mb-6">Direct shortcuts to invoke primary platform operational wizards</p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#2563EB]/5 text-[#0F172A] font-medium text-[13px] transition-all gap-2 group outline-none">
                  <Users className="h-5 w-5 text-[#2563EB] group-hover:scale-110 transition-transform" />
                  Add Candidate
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#22C55E] hover:bg-[#22C55E]/5 text-[#0F172A] font-medium text-[13px] transition-all gap-2 group outline-none">
                  <Briefcase className="h-5 w-5 text-[#22C55E] group-hover:scale-110 transition-transform" />
                  Create Job Posting
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#F59E0B] hover:bg-[#F59E0B]/5 text-[#0F172A] font-medium text-[13px] transition-all gap-2 group outline-none">
                  <FileText className="h-5 w-5 text-[#F59E0B] group-hover:scale-110 transition-transform" />
                  Review Folders
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#A855F7] hover:bg-[#A855F7]/5 text-[#0F172A] font-medium text-[13px] transition-all gap-2 group outline-none">
                  <FileSpreadsheet className="h-5 w-5 text-[#A855F7] group-hover:scale-110 transition-transform" />
                  Export CSV Logs
                </button>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* HORIZONTAL WORKFLOW PIPELINE PROGRESS TRACKER              */}
          {/* ========================================================== */}
          <section className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight m-0 mb-1">Active Core Recruitment Pipeline Stages</h3>
              <p className="text-[12px] text-[#64748B] m-0">Consolidated structural overview capturing aggregate flow metrics across stages</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 pt-2 relative">
              {[
                { stage: 'Applied', count: '142 Candidates', current: true },
                { stage: 'Screening', count: '64 Candidates', current: true },
                { stage: 'Technical Assessment', count: '42 Candidates', current: true },
                { stage: 'Executive Panel Interview', count: '18 Candidates', current: false },
                { stage: 'Offer Extended / Selected', count: '8 Selected', final: true }
              ].map((step, idx, arr) => (
                <React.Fragment key={step.stage}>
                  <div className="flex flex-col items-center text-center w-full max-w-[160px] relative z-10">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 text-[13px] font-bold transition-colors ${
                      step.final ? 'bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E]' :
                      step.current ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-[#2563EB]/15' : 'bg-white border-[#E2E8F0] text-[#94A3B8]'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="text-[13px] font-bold text-[#0F172A] mt-2.5 mb-0.5 whitespace-nowrap">{step.stage}</span>
                    <span className="text-[11px] font-medium text-[#64748B]">{step.count}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="hidden md:block flex-1 h-[2px] bg-[#E2E8F0] mx-2 -translate-y-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* RELATIONAL SYSTEM DATA GRID PANELS (CANDIDATES & JOBS)     */}
          {/* ========================================================== */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Panel Card Node: Recent Candidate Profiles Registry */}
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight m-0">Recent Candidate Stream</h3>
                  <p className="text-[12px] text-[#64748B] m-0">Realtime activity tracking capturing fresh applications pipeline input</p>
                </div>
                <Link to="/candidates" className="text-[12px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                  View Registry <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Candidate Name</th>
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Target Position</th>
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Status Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_CANDIDATES.map((candidate) => (
                      <tr key={candidate.id} className="border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors group">
                        <td className="py-3.5 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#F1F5F9] text-[#0F172A] font-bold text-[12px] flex items-center justify-center group-hover:bg-[#2563EB]/10 group-hover:text-[#2563EB] transition-colors">
                            {candidate.initial}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[#0F172A]">{candidate.name}</span>
                            <span className="text-[11px] font-medium text-[#64748B]">Exp: {candidate.experience}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-[13px] font-medium text-[#475569]">{candidate.position}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            candidate.status === 'Selected' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                            candidate.status === 'Interview' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                            candidate.status === 'Rejected' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#2563EB]/10 text-[#2563EB]'
                          }`}>
                            <div className={`w-1 h-1 rounded-full ${
                              candidate.status === 'Selected' ? 'bg-[#22C55E]' :
                              candidate.status === 'Interview' ? 'bg-[#F59E0B]' :
                              candidate.status === 'Rejected' ? 'bg-[#EF4444]' : 'bg-[#2563EB]'
                            }`} />
                            {candidate.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Panel Card Node: Recent Job Posting Metrics */}
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight m-0">Active Job Postings Overview</h3>
                  <p className="text-[12px] text-[#64748B] m-0">Corporate job requisitions and allocation budget mappings</p>
                </div>
                <Link to="/jobs" className="text-[12px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                  View Job Openings <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Job Details</th>
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Department / Location</th>
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_JOBS.map((job) => (
                      <tr key={job.id} className="border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[#0F172A]">{job.title}</span>
                            <span className="text-[11px] font-semibold text-[#64748B]">{job.salary}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-[#475569]">{job.dept}</span>
                            <span className="text-[11px] font-medium text-[#94A3B8]">{job.loc}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            job.status === 'Open' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#64748B]/10 text-[#64748B]'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </main>
      </div>

    </div>
  );
}