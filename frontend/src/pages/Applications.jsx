import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api/axios";

export default function Applications() {
  const navigate = useNavigate();

  // --- STATE ---
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering & UI controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/applications');
      
      // Dynamic Data Ingestion Pipeline / Safe Fallback Probe
      let rawData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          rawData = response.data;
        } else if (response.data.applications && Array.isArray(response.data.applications)) {
          rawData = response.data.applications;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          rawData = response.data.data;
        }
      }

      // Strict Field Mapper & Normalization Layer
      const mappedApps = rawData.map((app) => ({
        id: app.id || app._id,
        candidateName:
          app.candidate_name ||
          app.candidateName ||
          app.name ||
          "Unknown Candidate",
        email: app.email || '',
        position: app.position || app.job_title || 'Not Specified',
        company: app.company || 'Internal',
        status: app.status || app.current_stage || 'Applied',
        date: app.date || app.createdAt || new Date().toISOString(),
        rating: app.rating ? parseFloat(app.rating) : null,
        cvUrl: app.cvUrl || app.resume_path || null,
        notes: app.notes || '',
        interview: app.interview_details || app.interview || null,
      }));

      setApplications(mappedApps);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load application registry. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // --- MUTATION HANDLERS (With Fail-safes) ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this application record?')) {
      return;
    }
    try {
      await API.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error('Deletion operation failed:', err);
      alert('Could not delete record. Server configuration fallback triggered.');
    }
  };

  const handleDownloadCV = (url, name) => {
    if (!url) {
      alert('No CV file linked for this applicant record.');
      return;
    }
    // Safe multi-strategy download anchor fallback
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CV_${name.replace(/\s+/g, '_')}`);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- DYNAMIC FUNNEL AGGREGATES & DERIVED MATRICES ---
  const getStageCount = (stage) => applications.filter((a) => a.status === stage).length;

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Derived Timeline Activities
  const dynamicActivities = [...applications]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Derived Impending Interview Alert Matrix
  const upcomingInterviewApp = applications.find(
    (app) => app.interview && new Date(app.interview.date || app.interview) > new Date()
  );

  // --- TIME CUSTOMIZATION UTILITY ---
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // --- PRESENTATION RENDERING ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Synchronizing enterprise tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">
      {/* Header Banner Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Application Processing Hub</h1>
          <p className="text-slate-500 mt-1">Real-time candidate pipelines, analytics parsing, and operational staging control.</p>
        </div>
        <button
          onClick={() => navigate('/applications/create')}
          className="mt-4 md:mt-0 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition duration-150 ease-in-out flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Ingest New Application
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Grid Dashboard Analytics Layer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Ingested', count: applications.length, color: 'border-blue-500 bg-blue-50/50 text-blue-700' },
          { label: 'Screening/Interview', count: getStageCount('Interview') + getStageCount('Screening'), color: 'border-amber-500 bg-amber-50/50 text-amber-700' },
          { label: 'Selected Contracts', count: getStageCount('Selected') + getStageCount('Offer'), color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700' },
          { label: 'Archived / Rejected', count: getStageCount('Rejected'), color: 'border-rose-500 bg-rose-50/50 text-rose-700' },
        ].map((tile, i) => (
          <div key={i} className={`p-5 rounded-xl border bg-white shadow-sm flex flex-col justify-between transition-all hover:shadow-md`}>
            <span className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{tile.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{tile.count}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tile.color}`}>Active Segment</span>
            </div>
          </div>
        ))}
      </div>

      {/* Auxiliary Operational Context Layer (Split view) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Dynamic Activity Feeder */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-md font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Live Chronological Pipeline Feed
          </h3>
          <div className="divide-y divide-slate-100 max-h-[180px] overflow-y-auto pr-2">
            {dynamicActivities.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No structural logs detected in system memory.</p>
            ) : (
              dynamicActivities.map((act) => (
                <div key={act.id} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="truncate pr-4">
                    <span className="font-semibold text-slate-800">{act.candidateName}</span>
                    <span className="text-slate-400 mx-1.5">filed for</span>
                    <span className="font-medium text-indigo-600 bg-indigo-50/70 px-1.5 py-0.5 rounded text-xs">{act.position}</span>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(act.date)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic System Alert Flag */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-900 mb-1 flex items-center gap-2 text-amber-700">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Next Scheduled Action
            </h3>
            {upcomingInterviewApp ? (
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                Candidate <strong className="text-slate-900">{upcomingInterviewApp.candidateName}</strong> is targeted for active routing. Ensure status fields are synchronized.
              </p>
            ) : (
              <p className="text-sm text-slate-400 mt-2">No impending action alerts dynamically identified across operational dataset.</p>
            )}
          </div>
          {upcomingInterviewApp && (
            <button 
              onClick={() => navigate(`/applications/${upcomingInterviewApp.id}`)}
              className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 text-left transition"
            >
              Inspect Target Record &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Interactive Controls Segment */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Search matching applicant names, titles, target entities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium transition"
          >
            <option value="All">All Pipelines</option>
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <div className="border border-slate-200 rounded-lg p-0.5 flex bg-slate-50 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table View Layout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid Block Layout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Primary Array Visualization Renderer */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-slate-500 font-medium">No application parameters matched the filter matrix selection criteria.</p>
          <button onClick={() => { setSearchQuery(''); setStatusFilter('All'); }} className="mt-2 text-sm text-indigo-600 font-semibold hover:underline">Reset Functional Parameters</button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE INTERFACE SCHEMATIC */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Target Candidate</th>
                  <th className="px-6 py-4">Corporate Pipeline</th>
                  <th className="px-6 py-4">Filing Date</th>
                  <th className="px-6 py-4">Status Vector</th>
                  <th className="px-6 py-4 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{app.candidate_name || app.candidateName || "Unknown Candidate"}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{app.email || 'No email link registered'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{app.position}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{app.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatDate(app.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border ${
                        app.status === 'Selected' || app.status === 'Offer' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        app.status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                        app.status === 'Interview' || app.status === 'Screening' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold space-x-2">
                      <button
                        onClick={() => navigate(`/applications/${app.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded transition"
                      >
                        View Application
                      </button>
                      <button
                        onClick={() => navigate(`/applications/${app.id}/interview`)}
                        className="text-amber-600 hover:text-amber-900 px-2 py-1 bg-amber-50 hover:bg-amber-100 rounded transition"
                      >
                        Schedule Interview
                      </button>
                      <button
                        onClick={() => handleDownloadCV(app.cvUrl, app.candidateName)}
                        className={`px-2 py-1 rounded border transition ${app.cvUrl ? 'text-slate-600 border-slate-200 bg-white hover:bg-slate-50' : 'text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed'}`}
                        disabled={!app.cvUrl}
                      >
                        Download CV File
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-rose-600 hover:text-rose-900 px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded transition"
                      >
                        Delete Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* BLOCK GRID INTERFACE SCHEMATIC */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 line-clamp-1">{app.candidate_name || app.candidateName || "Unknown Candidate"}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{app.email || 'No registry email'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${
                    app.status === 'Selected' || app.status === 'Offer' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                    app.status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                    app.status === 'Interview' || app.status === 'Screening' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-sm mb-4">
                  <div className="font-semibold text-slate-800 line-clamp-1">{app.position}</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">{app.company}</div>
                  <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Logged: {formatDate(app.date)}
                  </div>
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-500 line-clamp-2 italic mb-4 bg-white px-1">
                    &ldquo;{app.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="w-full text-center py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => navigate(`/applications/${app.id}/interview`)}
                    className="w-full text-center py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                  >
                    Schedule Interview
                  </button>
                </div>
                
                <div className="flex items-center justify-between gap-2 mt-1 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      onClick={() => handleDownloadCV(app.cvUrl, app.candidateName)}
                      className={`hover:underline ${app.cvUrl ? 'text-slate-600' : 'text-slate-300 cursor-not-allowed'}`}
                      disabled={!app.cvUrl}
                    >
                      CV File
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-rose-600 hover:text-rose-800 transition"
                    >
                      Delete Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}