import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '../../utils/cn';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Main content area */}
      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col min-h-screen"
      >
        <Navbar
          sidebarCollapsed={collapsed}
          onMenuToggle={() => setCollapsed((c) => !c)}
        />

        {/* Page content */}
        <main className="flex-1 pt-16 overflow-x-hidden">
          <div className="p-6 max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
}
