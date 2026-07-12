import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Plus, FileSpreadsheet, Search, Filter, LayoutGrid, 
  List, ArrowUpDown, PieChart, AlertCircle 
} from 'lucide-react';
import { JobCard, JobCardEmptyState } from '../components/JobCard';
import API from "../api/axios";

export default function Jobs() {
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    openPositions: 0,
    departmentsHiring: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchWorkflowSystemData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Dynamically load both jobs and live applications concurrently
      const [jobsRes, appsRes] = await Promise.all([
        API.get('/jobs'),
        API.get('/applications')
      ]);

      const rawJobs = jobsRes.data?.jobs || jobsRes.data?.data || jobsRes.data || [];
      const rawApps = appsRes.data?.applications || appsRes.data?.data || appsRes.data || [];

      // Intersect and calculate active runtime counts for every specific job
      const resolvedJobs = rawJobs.map(job => {
        // Safe string matching fallback for variations in MongoDB IDs (_id vs id)
        const targetJobId = String(job.id || job._id || '');
        const relatedApps = rawApps.filter(app => String(app.job_id || app.jobId || '') === targetJobId);

        return {
          ...job,
          // Hydrate metrics dynamically matching the application state conditions
          applicationsCount: relatedApps.length,
          interviewedCount: relatedApps.filter(app => app.status?.toLowerCase() === 'interview').length,
          selectedCount: relatedApps.filter(app => app.status?.toLowerCase() === 'selected').length
        };
      });

      setJobs(resolvedJobs);

      const openPositions = resolvedJobs.filter(
        job => job.status?.toLowerCase() === "open"
      ).length;

      const departmentsHiring = new Set(
        resolvedJobs
          .filter(job => job.status?.toLowerCase() === "open")
          .map(job => job.department)
      ).size;

      setDashboardStats({
        openPositions,
        departmentsHiring
      });

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setErrorMessage(err.response?.data?.message || "Operational infrastructure error occurred syncing repository matrix parameters.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowSystemData();
  }, []);

  const handleAction = async (action, id) => {
    if (action === 'edit') {
      navigate(`/jobs/edit/${id}`);
    } else if (action === 'view') {
      navigate(`/jobs/${id}`);
    } else if (action === 'delete') {
      if (!window.confirm("Are you certain you wish to purge this job opening from system storage?")) return;
      try {
        await API.delete(`/jobs/${id}`);
        await fetchWorkflowSystemData();
      } catch (err) {
        setErrorMessage(err.response?.data?.message || "Failed executing target entity destructive operational cycles.");
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    const titleContext = (job.title || '').toLowerCase();
    const deptContext = (job.department || '').toLowerCase();
    const locContext = (job.location || '').toLowerCase();
    const skillsString = Array.isArray(job.skills) ? job.skills.join(' ') : (job.skills || '');
    
    const matchesSearch = 
      titleContext.includes(searchQuery.toLowerCase()) ||
      deptContext.includes(searchQuery.toLowerCase()) ||
      locContext.includes(searchQuery.toLowerCase()) ||
      skillsString.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === 'All' || (job.department && job.department.includes(deptFilter));
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesType = typeFilter === 'All' || job.type === typeFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'department') return (a.department || '').localeCompare(b.department || '');
    return (b.id || b._id || 0) - (a.id || a._id || 0);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-8 w-full max-w-full text-left font-sans antialiased"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] sm:text-[34px] font-bold text-[#0F172A] tracking-tight leading-none mb-2">Jobs</h1>
          <p className="text-[14px] sm:text-[15px] font-medium text-[#64748B]">Manage job openings, departments, and active recruitment campaigns.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-[44px] px-4 border border-[#E2E8F0] hover:border-[#2563EB] bg-white text-[#475569] hover:text-[#2563EB] text-[15px] font-semibold rounded-xl transition-colors inline-flex items-center gap-2 outline-none shadow-sm">
            <FileSpreadsheet className="w-4 h-4" /> Export Jobs
          </button>
          <button onClick={() => navigate('/jobs/new')} className="h-[44px] px-4 bg-[#2563EB] text-white text-[15px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all flex items-center gap-2 shadow-sm outline-none">
            <Plus className="w-4 h-4" /> Create Job
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 text-[#EF4444] rounded-2xl flex items-start gap-3 text-[14px] font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        {[
          { label: 'Open Positions', value: dashboardStats.openPositions, trend: 'Active Vector', icon: Briefcase, color: '#2563EB', bg: 'rgba(37,99,235,0.06)' },
          { label: 'Departments Hiring', value: dashboardStats.departmentsHiring, trend: 'Active Scopes', icon: PieChart, color: '#A855F7', bg: 'rgba(168,85,247,0.06)' }
        ].map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider">{card.label}</span>
                <span className="text-[24px] font-bold text-[#0F172A] tracking-tight">{card.value}</span>
                <span className="text-[12px] font-semibold text-[#22C55E]">{card.trend}</span>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[#E2E8F0] p-4 rounded-[20px] shadow-sm flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search jobs by title, department, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[44px] pl-10 pr-4 bg-[#F8FAFC] border border-transparent focus:border-[#2563EB] focus:bg-white rounded-full text-[14px] font-medium outline-none transition-all text-[#0F172A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-[#64748B]" />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-[38px] px-3 border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#475569] bg-white outline-none">
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product Design</option>
            <option value="Operations">Operations</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-[38px] px-3 border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#475569] bg-white outline-none">
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Urgent Hiring">Urgent Hiring</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
          </select>

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-[38px] px-3 border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#475569] bg-white outline-none">
            <option value="All">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>

          <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-3">
            <ArrowUpDown className="w-4 h-4 text-[#64748B]" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-[38px] px-3 border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#475569] bg-white outline-none">
              <option value="newest">Sort: Newest</option>
              <option value="title">Sort: Job Title</option>
              <option value="department">Sort: Department</option>
            </select>
          </div>

          <div className="flex items-center border border-[#E2E8F0] rounded-xl p-0.5 bg-[#F8FAFC]">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-[#64748B]'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-[#64748B]'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="w-full bg-white border border-[#E2E8F0] rounded-[20px] p-6 flex flex-col gap-4 animate-pulse">
              <div className="h-6 bg-[#F1F5F9] rounded w-3/4" />
              <div className="h-4 bg-[#F1F5F9] rounded w-1/4" />
              <div className="w-full h-8 bg-[#F1F5F9] rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <JobCardEmptyState onCreate={() => navigate('/jobs/new')} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map(job => (
              <JobCard key={job.id || job._id} job={job} onAction={handleAction} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-sm w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Job Title</th>
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Department</th>
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Location</th>
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                  <th className="p-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider text-right">Volume</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id || job._id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/40 transition-colors">
                    <td className="p-4 font-bold text-[#0F172A] text-[15px]">{job.title}</td>
                    <td className="p-4 font-medium text-[#475569] text-[14px]">{job.department}</td>
                    <td className="p-4 text-[#64748B] text-[14px]">{job.location}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-[#F1F5F9] text-[#475569] rounded-md text-[12px] font-bold">{job.status}</span>
                    </td>
                    <td className="p-4 text-right font-semibold text-[#0F172A] text-[14px]">{job.applicationsCount || 0} apps</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}