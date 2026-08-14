import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useThemeStore } from '@/store';
import { UserRole } from '@/types';

// Eager loaded
import LandingPage from '@/pages/Landing';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';

// Lazy loaded student
const StudentDashboard = lazy(() => import('@/pages/student/Dashboard'));
const StudentAnalyze = lazy(() => import('@/pages/student/Analyze'));
const StudentEssays = lazy(() => import('@/pages/student/Essays'));
const StudentEssayView = lazy(() => import('@/pages/student/EssayView'));
const StudentCompare = lazy(() => import('@/pages/student/Compare'));
const StudentReports = lazy(() => import('@/pages/student/Reports'));
const StudentSettings = lazy(() => import('@/pages/student/Settings'));

// Lazy loaded faculty
const FacultyDashboard = lazy(() => import('@/pages/faculty/Dashboard'));
const FacultyStudents = lazy(() => import('@/pages/faculty/Students'));
const FacultyEssays = lazy(() => import('@/pages/faculty/Essays'));
const FacultyBatch = lazy(() => import('@/pages/faculty/BatchAnalysis'));
const FacultyReports = lazy(() => import('@/pages/faculty/Reports'));

// Lazy loaded admin
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminEssays = lazy(() => import('@/pages/admin/Essays'));
const AdminAnalytics = lazy(() => import('@/pages/admin/Analytics'));
const AdminAuditLogs = lazy(() => import('@/pages/admin/AuditLogs'));

// Layouts
import StudentLayout from '@/components/layout/StudentLayout';
import FacultyLayout from '@/components/layout/FacultyLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import PageLoader from '@/components/common/PageLoader';

// Route Guard
function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to={`/${user?.role}`} replace />;
  return <>{children}</>;
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  // Apply immediately (synchronous) so there's no flash after mount
  document.documentElement.classList.toggle('dark', theme === 'dark');
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #0f172a)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student */}
            <Route path="/student" element={<RequireAuth role="student"><StudentLayout /></RequireAuth>}>
              <Route index element={<StudentDashboard />} />
              <Route path="analyze" element={<StudentAnalyze />} />
              <Route path="essays" element={<StudentEssays />} />
              <Route path="essays/:id" element={<StudentEssayView />} />
              <Route path="compare" element={<StudentCompare />} />
              <Route path="reports" element={<StudentReports />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            {/* Faculty */}
            <Route path="/faculty" element={<RequireAuth role="faculty"><FacultyLayout /></RequireAuth>}>
              <Route index element={<FacultyDashboard />} />
              <Route path="students" element={<FacultyStudents />} />
              <Route path="essays" element={<FacultyEssays />} />
              <Route path="batch-analysis" element={<FacultyBatch />} />
              <Route path="reports" element={<FacultyReports />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="essays" element={<AdminEssays />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
