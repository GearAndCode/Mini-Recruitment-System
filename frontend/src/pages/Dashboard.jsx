import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Briefcase, FileText, Calendar, Bell, Search, ChevronDown, 
  Menu, X, LayoutDashboard, LogOut, ArrowUpRight, Plus, 
  CheckCircle2, AlertCircle, Clock, FileSpreadsheet, Sparkles, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import API from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Application data states
  const [currentUser, setCurrentUser] = useState({ name: 'User', role: 'Recruitment Staff', initials: 'U' });
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic system time clock
  const currentFormattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  useEffect(() => {
    // 1. Session parsing lifecycle hook
    try {
      const storedUser = localStorage.getItem('rec_user') || sessionStorage.getItem('rec_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.name) {
          const names = parsedUser.name.trim().split(' ');
          const initials = names.length > 1 
            ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            : `${names[0][0] || 'U'}`.toUpperCase();

          setCurrentUser({
            name: parsedUser.name,
            role: parsedUser.role || 'Recruiter/HR Staff',
            initials: initials
          });
        }
      }
    } catch (e) {
      // Graceful fallback containment
    }

    // 2. Hydrate operational REST API endpoints concurrently
    const fetchDashboardContextMatrix = async () => {
      try {
        setLoading(true);
        setError(null);

        const [candidatesRes, jobsRes, applicationsRes] = await Promise.all([
          API.get('/candidates'),
          API.get('/jobs'),
          API.get('/applications')
        ]);

      setCandidates(candidatesRes.data.data || candidatesRes.data.candidates || []);
setJobs(jobsRes.data.data || jobsRes.data.jobs || []);
setApplications(applicationsRes.data.data || applicationsRes.data.applications || []);
      } catch (err) {
        setError("System failed to establish an active synchronization handshake with runtime microservices.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardContextMatrix();
  }, []);

  // Compute live analytical indicators dynamically
  const metrics = useMemo(() => {
    const totalCandidates = candidates.length;
    const activeJobs = jobs.filter(j => j.status?.toLowerCase() === 'active' || j.status?.toLowerCase() === 'open').length;
    const totalApps = applications.length;
    const totalInterviews = applications.filter(a => a.status?.toLowerCase() === 'interview').length;
    const totalSelected = applications.filter(a => a.status?.toLowerCase() === 'selected').length;
    const totalRejected = applications.filter(a => a.status?.toLowerCase() === 'rejected').length;

    return { totalCandidates, activeJobs, totalApps, totalInterviews, totalSelected, totalRejected };
  }, [candidates, jobs, applications]);

  // Generate real monthly trend aggregates dynamically mapping created_at logs
  const chartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};

    // Seed the matrix chronologically tracking the last 6 calendar periods
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonthIndex - i, 1);
      const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
      monthlyMap[label] = 0;
    }

    candidates.forEach(c => {
      if (!c.created_at) return;
      const date = new Date(c.created_at);
      const label = `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`;
      if (monthlyMap[label] !== undefined) {
        monthlyMap[label] += 1;
      }
    });

    return Object.keys(monthlyMap).map(key => ({
      name: key,
      "Candidates Created": monthlyMap[key]
    }));
  }, [candidates]);

  // Unified global searching layer parsing entries matching criteria query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();

    const filteredCandidates = candidates.filter(c => c.full_name?.toLowerCase().includes(query) || c.email?.toLowerCase().includes(query));
    const filteredJobs = jobs.filter(j => j.title?.toLowerCase().includes(query) || j.department?.toLowerCase().includes(query));
    const filteredApps = applications.filter(a => a.candidate_name?.toLowerCase().includes(query) || a.job_title?.toLowerCase().includes(query));

    return { candidates: filteredCandidates, jobs: filteredJobs, applications: filteredApps };
  }, [searchQuery, candidates, jobs, applications]);

  // Client-side tabular spreadsheet generation downloading system data structures
  const handleExportCSVLogs = () => {
    const convertToCSV = (objArray) => {
      if (!objArray || objArray.length === 0) return '';
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      const headers = Object.keys(array[0]).join(',');
      const rows = array.map(row => 
        Object.values(row).map(val => {
          let str = val === null || val === undefined ? '' : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        }).join(',')
      );
      return [headers, ...rows].join('\r\n');
    };

    const downloadCSVFile = (csvContent, fileName) => {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (candidates.length > 0) downloadCSVFile(convertToCSV(candidates), `Candidates_Logs_${Date.now()}.csv`);
    if (jobs.length > 0) downloadCSVFile(convertToCSV(jobs), `Jobs_Logs_${Date.now()}.csv`);
    if (applications.length > 0) downloadCSVFile(convertToCSV(applications), `Applications_Logs_${Date.now()}.csv`);
  };

  const handleSignOutAction = () => {
    localStorage.removeItem('rec_user');
    sessionStorage.removeItem('rec_user');
    navigate('/login');
  };

  // 9. LOADING STATES (Skeleton UI Platform Enforcer Layer)
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-[#2563EB] rounded-[14px] flex items-center justify-center text-white font-black text-[16px] shadow-lg shadow-[#2563EB]/20 animate-bounce">
            MR
          </div>
          <div className="flex items-center gap-2 mt-2">
            <RefreshCw className="w-4 h-4 text-[#2563EB] animate-spin" />
            <span className="text-[14px] font-bold text-[#0F172A] tracking-tight">Resolving Dashboard Metrics...</span>
          </div>
        </div>
      </div>
    );
  }

  // 10. ERROR STATES (Robust Network Interruption Resiliency Overlay UI)
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-[24px] p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 bg-[#EF4444]/5 border border-[#EF4444]/10 rounded-2xl flex items-center justify-center text-[#EF4444] mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight mb-2">Workspace Connection Failure</h2>
          <p className="text-[13.5px] text-[#64748B] mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="h-[42px] px-5 bg-[#2563EB] text-white text-[13.5px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-sm outline-none flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Re-establish Context Handshake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans text-[#334155] flex antialiased selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      
      {/* ========================================================== */}
      {/* DESKTOP SIDEBAR NAVIGATION                                 */}
      {/* ========================================================== */}
      <aside className="hidden md:flex w-[260px] bg-white border-r border-[#E2E8F0] fixed h-full z-30 flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-md shadow-[#2563EB]/15 text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#0F172A] tracking-tight mb-0.5 leading-tight">Mini Recruitment</span>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider leading-none">Workflow System</span>
            </div>
          </div>

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

        <button 
          onClick={handleSignOutAction}
          className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-[#EF4444] hover:bg-[#EF4444]/5 font-medium text-[14px] transition-all duration-200 text-left outline-none w-full"
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
          <span className="text-[14px] font-bold text-[#0F172A]">Recruitment Management System</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-9 w-9 border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#334155] outline-none"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

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
              className="flex items-center gap-3 px-4 h-[44px] border border-[#E2E8F0] rounded-xl text-[#EF4444] font-medium text-[14px] w-full text-left"
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
        
        <header className="h-[70px] bg-white border-b border-[#E2E8F0] hidden md:flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h1 className="text-[16px] font-semibold text-[#0F172A] m-0 leading-none mb-1">Dashboard Overview</h1>
            <p className="text-[12px] font-medium text-[#64748B] m-0 leading-none">Home / Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <input 
                type="text" 
                placeholder="Search candidates or positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[38px] pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder-[#94A3B8] focus:border-[#2563EB] transition-all"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="h-[38px] w-[38px] border border-[#E2E8F0] rounded-xl flex items-center justify-center relative hover:bg-[#F8FAFC] transition-colors outline-none"
              >
                <Bell className="h-4 w-4 text-[#475569]" />
                {applications.length > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2563EB]" />}
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
                      <span className="text-[13px] font-bold text-[#0F172A]">System Log Activity</span>
                      <span className="text-[11px] font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded-full">Live Feed</span>
                    </div>
                    <div className="flex flex-col gap-2.5 max-h-[240px] overflow-y-auto">
                      {applications.slice(0, 4).map((app, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                          <div className="h-2 w-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                          <div>
                            <p className="text-[12px] font-semibold text-[#0F172A] m-0">Application Stream Update</p>
                            <p className="text-[11px] text-[#64748B] m-0">{app.candidate_name || 'Candidate'} applied for {app.job_title || 'Position'}</p>
                          </div>
                        </div>
                      ))}
                      {applications.length === 0 && (
                        <p className="text-[12px] text-[#94A3B8] text-center py-4">No recent tracking updates</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 py-1 pr-1 border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors outline-none"
              >
                <div className="h-7 w-7 rounded-lg bg-[#0F172A] flex items-center justify-center font-bold text-white text-[12px]">
                  {currentUser.initials}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[12px] font-bold text-[#0F172A] leading-none mb-0.5">{currentUser.name}</span>
                  <span className="text-[10px] font-medium text-[#64748B] leading-none">{currentUser.role}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#64748B] mr-1" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-[1600px] w-full mx-auto">
          
          {/* Welcome Title Segment */}
          <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-[22px] md:text-[24px] font-bold text-[#0F172A] tracking-tight mb-1">
                Welcome back, {currentUser.name} 👋
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
          {/* SEARCH METRICS MATRIX OVERLAY LAYER                         */}
          {/* ========================================================== */}
          <AnimatePresence>
            {searchQuery.trim() && searchResults && (
              <motion.section 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-[#2563EB]/20 rounded-[20px] p-6 shadow-md"
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E2E8F0]">
                  <h3 className="text-[14px] font-bold text-[#0F172A]">Search Index Interception Results for "{searchQuery}"</h3>
                  <button onClick={() => setSearchQuery('')} className="text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A]">Clear Index Filter</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-[12px] font-bold text-[#2563EB] mb-2 uppercase tracking-wider">Candidates ({searchResults.candidates.length})</h4>
                    <ul className="text-[13px] space-y-1 max-h-[150px] overflow-y-auto">
                      {searchResults.candidates.map((c, i) => <li key={i} className="py-1 border-b border-[#F1F5F9] text-[#0F172A] font-medium">{c.full_name} <span className="text-[#64748B] font-normal">({c.email})</span></li>)}
                      {searchResults.candidates.length === 0 && <li className="text-[#94A3B8] italic">No match found</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-[#22C55E] mb-2 uppercase tracking-wider">Jobs ({searchResults.jobs.length})</h4>
                    <ul className="text-[13px] space-y-1 max-h-[150px] overflow-y-auto">
                      {searchResults.jobs.map((j, i) => <li key={i} className="py-1 border-b border-[#F1F5F9] text-[#0F172A] font-medium">{j.title} <span className="text-[#64748B] font-normal">({j.department})</span></li>)}
                      {searchResults.jobs.length === 0 && <li className="text-[#94A3B8] italic">No match found</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-[#F59E0B] mb-2 uppercase tracking-wider">Applications ({searchResults.applications.length})</h4>
                    <ul className="text-[13px] space-y-1 max-h-[150px] overflow-y-auto">
                      {searchResults.applications.map((a, i) => <li key={i} className="py-1 border-b border-[#F1F5F9] text-[#0F172A] font-medium">{a.candidate_name || 'Candidate'} → {a.job_title || 'Position'}</li>)}
                      {searchResults.applications.length === 0 && <li className="text-[#94A3B8] italic">No match found</li>}
                    </ul>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ========================================================== */}
          {/* STATS OVERVIEW CARDS (KPI PLATFORMS GRID)                  */}
          {/* ========================================================== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { id: 'candidates', title: 'Total Candidates', value: metrics.totalCandidates, icon: Users, color: '#2563EB', bgColor: 'rgba(37, 99, 235, 0.08)' },
              { id: 'jobs', title: 'Active Jobs', value: metrics.activeJobs, icon: Briefcase, color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.08)' },
              { id: 'applications', title: 'Applications', value: metrics.totalApps, icon: FileText, color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.08)' },
              { id: 'interviews', title: 'Interviews Scheduled', value: metrics.totalInterviews, icon: Calendar, color: '#A855F7', bgColor: 'rgba(168, 85, 247, 0.08)' }
            ].map((card, index) => {
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
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: card.bgColor, color: card.color }}
                    >
                      <IconComponent className="h-[18px] w-[18px]" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[28px] font-bold text-[#0F172A] tracking-tight">{card.value}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] font-normal mt-2">Evaluation run tracking active repository indexes</p>
                </motion.div>
              );
            })}
          </section>

          {/* ========================================================== */}
          {/* ANALYTICS CHARTS / QUICK CONFIG PANEL CONTAINER            */}
          {/* ========================================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 lg:col-span-2 flex flex-col justify-between min-h-[340px] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight m-0">Recruitment Analytics Flow</h3>
                  <p className="text-[12px] text-[#64748B] m-0">Metrics capturing incoming application load over the last six months</p>
                </div>
                <span className="text-[12px] font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-xl">Historical Trend</span>
              </div>
              
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="Candidates Created" stroke="#2563EB" strokeWidth={2.5} fillOpacity={0.1} fill="rgba(37, 99, 235, 0.15)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight m-0 mb-1">Quick Configuration Panel</h3>
                <p className="text-[12px] text-[#64748B] m-0 mb-6">Direct shortcuts to invoke primary platform operational wizards</p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                <button onClick={() => navigate("/candidates/new")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#2563EB]/5 text-[#0F172A] font-medium text-[13px] transition-all gap-2 group outline-none">
                  <Users className="h-5 w-5 text-[#2563EB] group-hover:scale-110 transition-transform" />
                  Add Candidate
                </button>
                <button onClick={() => navigate("/jobs/new")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#22C55E] hover:bg-[#22C55E]/5 text-[#0F172A] font-medium text-[13px] transition-all gap-2 group outline-none">
                  <Briefcase className="h-5 w-5 text-[#22C55E] group-hover:scale-110 transition-transform" />
                  Create Job Posting
                </button>
                <button onClick={() => navigate("/applications")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#F59E0B] hover:bg-[#F59E0B]/5 text-[#0F172A] font-medium text-[13px] transition-all gap-2 group outline-none">
                  <FileText className="h-5 w-5 text-[#F59E0B] group-hover:scale-110 transition-transform" />
                  Review Folders
                </button>
                <button onClick={handleExportCSVLogs} className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#A855F7] hover:bg-[#A855F7]/5 text-[#0F172A] font-medium text-[13px] transition-all gap-2 group outline-none">
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
                { stage: 'Candidates', count: `${metrics.totalCandidates} Total` },
                { stage: 'Applications', count: `${metrics.totalApps} Filed` },
                { stage: 'Interview', count: `${metrics.totalInterviews} Active` },
                { stage: 'Selected', count: `${metrics.totalSelected} Hired`, final: true },
                { stage: 'Rejected', count: `${metrics.totalRejected} Closed`, errorStage: true }
              ].map((step, idx, arr) => (
                <React.Fragment key={step.stage}>
                  <div className="flex flex-col items-center text-center w-full max-w-[160px] relative z-10">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 text-[13px] font-bold transition-colors ${
                      step.final ? 'bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E]' :
                      step.errorStage ? 'bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444]' :
                      'bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-[#2563EB]/15'
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
          {/* RECENT ACTIVITY DATA STREAM LAYER                         */}
          {/* ========================================================== */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
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
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Candidate</th>
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Email</th>
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.slice(0, 4).map((c, i) => (
                      <tr key={i} className="border-b border-[#F1F5F9] last:border-none hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 text-[13px] font-semibold text-[#0F172A]">{c.full_name}</td>
                        <td className="py-3 text-[13px] text-[#64748B]">{c.email}</td>
                        <td className="py-3 text-[12px] text-[#94A3B8]">{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}</td>
                      </tr>
                    ))}
                    {candidates.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-[13px] text-[#94A3B8] italic">No candidate accounts found in system repository context</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight m-0">Recent Positions Openings</h3>
                  <p className="text-[12px] text-[#64748B] m-0">Live status deployment monitoring for internal open requisitions</p>
                </div>
                <Link to="/jobs" className="text-[12px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                  View Positions <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Role Title</th>
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Department</th>
                      <th className="pb-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.slice(0, 4).map((j, i) => (
                      <tr key={i} className="border-b border-[#F1F5F9] last:border-none hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 text-[13px] font-semibold text-[#0F172A]">{j.title}</td>
                        <td className="py-3 text-[13px] text-[#64748B]">{j.department}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider ${
                            j.status?.toLowerCase() === 'active' || j.status?.toLowerCase() === 'open' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {j.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {jobs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-[13px] text-[#94A3B8] italic">No vacancies declared inside organizational node matrix</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
          
          <footer className="w-full mt-auto pt-8 pb-2 border-t border-slate-200 text-center text-[13px] font-medium text-slate-400 shrink-0">
            &copy; 2026 Mini Recruitment Workflow System
          </footer>
        </main>
      </div>
    </div>
  );
}