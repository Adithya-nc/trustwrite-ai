import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, FileSearch, BarChart3, ArrowLeftRight,
  FileOutput, Settings, LogOut, ChevronLeft, ChevronRight, Moon, Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useThemeStore, useUIStore } from '@/store';
import toast from 'react-hot-toast';

const studentNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/student' },
  { label: 'Analyze Essay', icon: FileSearch, to: '/student/analyze' },
  { label: 'My Essays', icon: FileText, to: '/student/essays' },
  { label: 'Compare', icon: ArrowLeftRight, to: '/student/compare' },
  { label: 'Reports', icon: FileOutput, to: '/student/reports' },
  { label: 'Settings', icon: Settings, to: '/student/settings' },
];

const facultyNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/faculty' },
  { label: 'Students', icon: FileText, to: '/faculty/students' },
  { label: 'Essays', icon: FileSearch, to: '/faculty/essays' },
  { label: 'Batch Analysis', icon: BarChart3, to: '/faculty/batch-analysis' },
  { label: 'Reports', icon: FileOutput, to: '/faculty/reports' },
];

const adminNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Users', icon: FileText, to: '/admin/users' },
  { label: 'Essays', icon: FileSearch, to: '/admin/essays' },
  { label: 'Analytics', icon: BarChart3, to: '/admin/analytics' },
  { label: 'Audit Logs', icon: FileOutput, to: '/admin/audit-logs' },
];

type NavItem = { label: string; icon: React.ElementType; to: string };

interface SidebarProps {
  nav: NavItem[];
}

function Sidebar({ nav }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-30 overflow-hidden"
    >
      {/* Header */}
      <div className={cn('flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800', sidebarCollapsed ? 'justify-center' : 'justify-between')}>
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                TrustWrite <span className="text-violet-600">AI</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {sidebarCollapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {nav.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 2}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl transition-all duration-150 group',
              sidebarCollapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5',
              isActive
                ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            )}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-2 space-y-0.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
            sidebarCollapsed && 'justify-center px-2'
          )}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {/* User info + logout */}
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer" onClick={handleLogout}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user?.name?.[0] || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 capitalize">{user?.role}</p>
            </div>
            <LogOut size={14} className="text-slate-400 group-hover:text-rose-500 transition-colors flex-shrink-0" />
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-2 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors"
          >
            <LogOut size={18} />
          </button>
        )}
        {/* Collapse toggle when expanded */}
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center px-2 py-2.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}

// Mobile header for app layouts
export function MobileAppHeader({ title }: { title?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-xs">T</span>
        </div>
        <span className="font-bold text-slate-900 dark:text-white text-sm">TrustWrite AI</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button onClick={() => { logout(); navigate('/login'); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-500">
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export function StudentSidebar() { return <Sidebar nav={studentNav} />; }
export function FacultySidebar() { return <Sidebar nav={facultyNav} />; }
export function AdminSidebar() { return <Sidebar nav={adminNav} />; }
