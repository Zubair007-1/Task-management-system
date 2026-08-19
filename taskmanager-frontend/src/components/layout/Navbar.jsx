import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Sun, Moon, Menu, X, Command,
  CheckCircle2, Clock, AlertCircle, Plus,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils/cn';

// Mock notifications
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'assigned',   text: 'New task assigned to you',    time: '2m ago',  read: false },
  { id: 2, type: 'deadline',   text: '"Design System" is due today', time: '1h ago',  read: false },
  { id: 3, type: 'completed',  text: 'Task "API Integration" done',  time: '3h ago',  read: true  },
  { id: 4, type: 'mention',    text: '@you mentioned in "Sprint 4"', time: '1d ago',  read: true  },
];

const notifIcon = {
  assigned:  <Plus className="w-3 h-3 text-indigo-500" />,
  deadline:  <Clock className="w-3 h-3 text-amber-500" />,
  completed: <CheckCircle2 className="w-3 h-3 text-green-500" />,
  mention:   <AlertCircle className="w-3 h-3 text-blue-500" />,
};

export default function Navbar({ onMenuToggle, sidebarCollapsed }) {
  const { dark, toggle: toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const searchRef = useRef(null);
  const notifRef  = useRef(null);
  const profileRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md',
          'border-b border-slate-100 dark:border-slate-800',
          'flex items-center px-4 gap-3 transition-all duration-250',
          sidebarCollapsed ? 'left-[72px]' : 'left-[260px]'
        )}
      >
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="btn btn-ghost p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-lg">
          <button
            onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
            className={cn(
              'w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm',
              'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
              'hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-text'
            )}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Search tasks…</span>
            <span className="hidden sm:flex items-center gap-1 text-xs bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
              <Command className="w-3 h-3" />K
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-2 rounded-xl"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={dark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{ rotate: 90,  opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-500" />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="btn btn-ghost p-2 rounded-xl relative"
              aria-label={`${unread} unread notifications`}
              id="notif-btn"
            >
              <Bell className="w-5 h-5 text-slate-500" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0,  scale: 1 }}
                  exit={{ opacity: 0,  y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 card shadow-premium-lg border border-slate-100 dark:border-slate-700/50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">Notifications</span>
                      {unread > 0 && (
                        <span className="badge badge-indigo">{unread}</span>
                      )}
                    </div>
                    {unread > 0 && (
                      <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer',
                          !n.read && 'bg-primary-50/50 dark:bg-primary-900/10'
                        )}
                      >
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                          {notifIcon[n.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{n.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-1 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative ml-1">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open profile menu"
              id="profile-btn"
            >
              <Avatar name={user?.name || user?.email} size="sm" />
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                {user?.name || 'User'}
              </span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-48 card shadow-premium-lg border border-slate-100 dark:border-slate-700/50 py-1 overflow-hidden"
                >
                  {[
                    { label: 'Profile',  path: '/profile'  },
                    { label: 'Settings', path: '/settings' },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Global Search Overlay (Ctrl+K) */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-xl"
            >
              <form onSubmit={handleSearch}>
                <div className="card shadow-premium-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      ref={searchRef}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search tasks, categories, users…"
                      className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="btn btn-ghost p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">↵</kbd> to search</span>
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Esc</kbd> to close</span>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
