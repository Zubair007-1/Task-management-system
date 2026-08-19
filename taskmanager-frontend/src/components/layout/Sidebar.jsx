import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Columns2, Calendar, BarChart2,
  Users, User, Settings, LogOut, ChevronLeft, ChevronRight,
  Zap, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Dashboard', path: '/',         icon: LayoutDashboard },
  { label: 'Tasks',     path: '/tasks',     icon: CheckSquare     },
  { label: 'Kanban',    path: '/kanban',    icon: Columns2        },
  { label: 'Calendar',  path: '/calendar',  icon: Calendar        },
  { label: 'Analytics', path: '/analytics', icon: BarChart2, adminOnly: true },
  { label: 'Team',      path: '/team',      icon: Users           },
];

const bottomItems = [
  { label: 'Profile',  path: '/profile',  icon: User     },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    if (confirmLogout) {
      logout();
      navigate('/login');
    } else {
      setConfirmLogout(true);
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  const filtered = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 h-screen z-30 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-premium shrink-0 overflow-hidden">
          <img src="https://img.favpng.com/22/0/8/task-management-project-management-performance-management-png-favpng-UN17R4QfF2ZpQyjcjHyHvm04m.jpg" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="font-bold text-lg text-gradient select-none whitespace-nowrap"
            >
              TaskFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filtered.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}

        <div className="divider my-3" />

        {bottomItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-1">
        <div className={cn('flex items-center gap-3 px-2 py-2 rounded-xl', !collapsed && 'hover:bg-slate-50 dark:hover:bg-slate-800/60')}>
          <Avatar name={user?.name || user?.email} size="sm" className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-link w-full',
            confirmLogout && 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30'
          )}
          title={collapsed ? (confirmLogout ? 'Click again' : 'Logout') : ''}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap text-sm"
              >
                {confirmLogout ? 'Confirm Logout?' : 'Logout'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-premium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-slate-500" />
          : <ChevronLeft  className="w-3 h-3 text-slate-500" />
        }
      </button>
    </motion.aside>
  );
}

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn('sidebar-link', isActive && 'sidebar-link-active')
      }
      title={collapsed ? item.label : ''}
    >
      {({ isActive }) => (
        <>
          <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary-600 dark:text-primary-400')} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {isActive && !collapsed && (
            <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 ml-auto shrink-0" />
          )}
        </>
      )}
    </NavLink>
  );
}
