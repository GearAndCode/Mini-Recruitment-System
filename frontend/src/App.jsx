import ViewApplication from "./pages/ViewApplication";
import ScheduleInterview from "./pages/ScheduleInterview";
import CreateApplication from "./pages/CreateApplication";
const EditJob = lazy(() => import('./pages/EditJob'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const AddCandidate = lazy(() => import('./pages/AddCandidate'));
import React, { createContext, useContext, useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, FileText, LogOut, 
  Menu, Bell, User, AlertCircle, RefreshCw 
} from 'lucide-react';

// ============================================================================
// 1. GLOBAL CORE AUTHENTICATION CONTEXT & PROVIDER SYSTEM
// ============================================================================
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('rec_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('rec_token'));
  const [initializing, setInitializing] = useState(true);
  const location = useLocation();

  // Dynamic document header title side-effect configuration mapping
  useEffect(() => {
    document.title = "Mini Recruitment Workflow System";
  }, [location]);

  useEffect(() => {
    // Structural parsing loop checking if token signature exists
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          handleLogout('Session expired. Please log in again.');
        }
      } catch (e) {
        // Fallback error containment logic
      }
    }
    setInitializing(false);
  }, [token]);

  const handleLogin = (userPayload, tokenPayload) => {
    localStorage.setItem('rec_user', JSON.stringify(userPayload));
    localStorage.setItem('rec_token', tokenPayload);
    setUser(userPayload);
    setToken(tokenPayload);
  };

  const handleLogout = (message = '') => {
    localStorage.removeItem('rec_user');
    localStorage.removeItem('rec_token');
    setUser(null);
    setToken(null);
    if (message) alert(message);
  };

  return (
    <AuthContext.Provider value={{ user, token, initializing, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ============================================================================
// 2. ROUTE GUARD PROTECTION INTERCEPTORS
// ============================================================================
function ProtectedRoute({ children }) {
  const { token, initializing } = useAuth();
  if (initializing) return <GlobalLoadingScreen />;
  return token ? children : <Navigate to="/" replace />;
}

// Intercepting layout wrapper rendering developer branding credits on public scope
function PublicGatewayScopeWrapper({ children }) {
  return (
    <div className="w-full flex flex-col items-center">
      {children}
      <DeveloperCreditFooter />
    </div>
  );
}

// Public routing guard tracking active credentials to enforce login dashboard locks
function PublicRoute({ children }) {
  const { token, initializing } = useAuth();
  if (initializing) return <GlobalLoadingScreen />;
  return !token ? children : <Navigate to="/dashboard" replace />;
}

// ============================================================================
// 3. LAZY-LOADED CORE APPLICATION ENTRY SHEETS
// ============================================================================
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.default || m.Login })));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Candidates = lazy(() => import('./pages/Candidates'));
const Jobs = lazy(() => import('./pages/Jobs'));
const CreateJob = lazy(() => import('./pages/CreateJob'));
const Applications = lazy(() => import('./pages/Applications'));

// Missing Candidate Pages Imports
const CreateCandidate = lazy(() => import('./pages/AddCandidate'));
const CandidateProfile = lazy(() => import('./pages/CandidateProfile'));

// ============================================================================
// 4. ENTERPRISE SHELL ROOT CORE MASTER TEMPLATE GRID
// ============================================================================
function AppLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close context drawer panel explicitly on dynamic endpoint migration hooks
  useEffect(() => setMobileSidebarOpen(false), [location]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Candidates', path: '/candidates', icon: Users },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Applications', path: '/applications', icon: FileText },
  ];

  // Dynamic structural generation mapping breadcrumbs path arrays
  const currentNav = navItems.find(item => item.path === location.pathname);
  const breadcrumbLabel = currentNav ? currentNav.label : 'Overview';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-white p-5 justify-between">
      <div>
        {/* Workspace Brand Lockup */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center font-black text-white text-[14px] tracking-tight shrink-0 shadow-sm shadow-[#2563EB]/40">
            MR
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="font-bold text-[14px] tracking-tight leading-tight text-white truncate">Mini Recruitment</span>
            <span className="text-[13px] font-medium text-slate-300 tracking-tight mt-0.5 truncate">Workflow System</span>
            <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-1.5 truncate">Recruitment Management Platform</span>
          </div>
        </div>

        {/* Action Route Interaction Map Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Primary Workspace Framework Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="outline-none">
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3.5 px-4 h-[46px] rounded-xl font-semibold text-[14px] transition-colors relative cursor-pointer ${
                    isActive ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-[#2563EB]/10' : 'text-[#94A3B8] hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Operator Status Badge Block */}
      <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-[13px] font-bold border border-slate-600 text-slate-200">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'OP'}
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[14px] font-bold text-slate-200 truncate">{user?.name || 'Recruiter Hub'}</span>
            <span className="text-[12px] font-medium text-slate-400 capitalize truncate">{user?.role || 'Access Node'}</span>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full h-[42px] rounded-xl bg-slate-800/40 hover:bg-[#EF4444]/10 text-slate-400 hover:text-[#EF4444] transition-all text-[13.5px] font-bold flex items-center justify-center gap-2 border border-slate-800 hover:border-[#EF4444]/20 outline-none"
        >
          <LogOut className="w-4 h-4" /> Sign Out Matrix
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex overflow-hidden font-sans antialiased selection:bg-[#2563EB]/10">
      {/* Permanent Static Sidebar Anchored Axis (Desktop Viewport Boundaries) */}
      <aside className="hidden lg:block w-[260px] h-screen shrink-0 border-r border-slate-200 sticky top-0 z-20">
        <SidebarContent />
      </aside>

      {/* Slide-out Overlay Drawer System (Mobile Viewport Boundaries) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="absolute left-0 top-0 bottom-0 w-[270px] shadow-2xl z-10"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Structural Right Column Viewport Containment Framework */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Core Sticky Top Module Header Ribbon */}
        <header className="h-[70px] bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-[#475569] lg:hidden outline-none"
              aria-label="Toggle structural operations core routing matrix map layout"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#64748B]">
              <span className="text-[#94A3B8]">App</span>
              <span className="text-[#E2E8F0] font-normal">/</span>
              <span className="text-[#0F172A] font-bold">{breadcrumbLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB]/40 flex items-center justify-center text-[#475569] hover:bg-slate-50 transition-all relative outline-none">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
            </button>
            <div className="h-8 w-[1px] bg-[#E2E8F0]" />
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#DBEAFE] text-white flex items-center justify-center text-[13px] font-bold shadow-inner">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Dynamic Nested Endpoint Target Structural Canvas */}
        <main className="p-4 sm:p-8 flex-1 w-full max-w-[1600px] mx-auto box-border flex flex-col justify-between">
          <div className="flex-1 w-full">
            <Suspense fallback={<GlobalLoadingScreen />}>
              <OutletLayoutWrapper key={location.pathname}>
                <Routes>
                  <Route path="/applications/:id/interview" element={<ScheduleInterview />} />
                  <Route path="/applications/:id" element={<ViewApplication />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/applications/create" element={<CreateApplication />} />                  
                  <Route path="/candidates" element={<Candidates />} />
                  
                  {/* Candidate Operations Matrix Deployment Scope */}
                  <Route path="/candidates/new" element={<AddCandidate />} />
                  <Route path="/candidates/:id" element={<CandidateProfile />} />
                  <Route path="/candidates/edit/:id" element={<CandidateProfile />} />
                  <Route path="/interviews/create/:id" element={<ScheduleInterview />} />

                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/new" element={<CreateJob />} />
                  <Route path="/jobs/edit/:id" element={<EditJob />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/applications" element={<Applications />} />

                  <Route path="*" element={<NotFoundPageFallback />} />
                </Routes>
              </OutletLayoutWrapper>
            </Suspense>
          </div>
          
          {/* Base System Standard Footer Layer */}
          <footer className="w-full mt-auto pt-8 pb-2 border-t border-slate-200 text-center text-[13px] font-medium text-slate-400 shrink-0">
            &copy; 2026 Mini Recruitment Workflow System
          </footer>
        </main>
      </div>
    </div>
  );
}

// Wrapper utility isolating framer motion node layouts across endpoints
function OutletLayoutWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// 5. PRIMITIVE FALLBACK COMPONENT STRUCTURAL NODES
// ============================================================================
export function GlobalLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[#2563EB] rounded-[14px] flex items-center justify-center text-white font-black text-[16px] shadow-lg shadow-[#2563EB]/20 animate-bounce">
          MR
        </div>
        <div className="flex items-center gap-2 mt-2">
          <RefreshCw className="w-4 h-4 text-[#2563EB] animate-spin" />
          <span className="text-[14px] font-bold text-[#0F172A] tracking-tight">Resolving Recruitment System...</span>
        </div>
      </div>
    </div>
  );
}

export function NotFoundPageFallback() {
  return (
    <div className="w-full min-h-[70vh] bg-white border border-[#E2E8F0] rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-[#EF4444]/5 border border-[#EF4444]/10 rounded-2xl flex items-center justify-center text-[#EF4444] mb-4 shadow-inner">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="text-[24px] font-bold text-[#0F172A] tracking-tight mb-1">Page Framework Out of Scope</h2>
      <p className="text-[14px] text-[#64748B] max-w-sm mb-6 leading-relaxed">
        The system routing parameter map could not parse an active deployment structural model tied to this resource destination link path.
      </p>
      <Link to="/dashboard" className="outline-none">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-[44px] px-5 bg-[#2563EB] text-white text-[14px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-sm outline-none"
        >
          Return to Dashboard Hub
        </motion.button>
      </Link>
    </div>
  );
}

// Isolation layout engine rendering developer branding credits on permitted scopes
function DeveloperCreditFooter() {
  return (
    <div className="w-full mt-6 pt-4 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-slate-500 tracking-tight border-t border-slate-100">
      <span>Developed by Hareem Atif</span>
      <span className="text-slate-300">|</span>
      <span className="inline-flex items-center gap-1">
        {/* Built-in high-performance inline SVG path replaces lucide-react reference check dependency */}
        <svg 
          className="w-3.5 h-3.5 text-slate-400 shrink-0" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <a 
          href="https://github.com/GearAndCode" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-500 hover:text-[#2563EB] transition-colors underline decoration-slate-300 hover:decoration-[#2563EB]"
        >
          GearAndCode
        </a>
      </span>
    </div>
  );
}

// ============================================================================
// 6. MAIN SYSTEM ROOT COMPONENT CONTROLLER CONFIGURATION
// ============================================================================
export default function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route
          path="/"
          element={
            <PublicRoute>
              <Suspense fallback={<GlobalLoadingScreen />}>
                <PublicGatewayScopeWrapper>
                  <Login />
                </PublicGatewayScopeWrapper>
              </Suspense>
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Suspense fallback={<GlobalLoadingScreen />}>
                <PublicGatewayScopeWrapper>
                  <Register />
                </PublicGatewayScopeWrapper>
              </Suspense>
            </PublicRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />

      </Routes>
    </AuthProvider>
  );
}