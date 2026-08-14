import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminSidebar, MobileAppHeader } from './Sidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <MobileAppHeader />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="md:pl-60 pt-14 md:pt-0 min-h-screen transition-all duration-300"
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
