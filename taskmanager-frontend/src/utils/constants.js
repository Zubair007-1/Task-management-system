// Priority levels
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

// Status values (must match backend)
export const STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

// Roles
export const ROLES = { USER: 'USER', ADMIN: 'ADMIN' };

// API base URL (proxied by Vite dev server)
export const API_BASE = '/api';

// Local storage keys
export const LS_TOKEN    = 'taskflow_token';
export const LS_USER     = 'taskflow_user';
export const LS_THEME    = 'taskflow_theme';
export const LS_REMEMBER = 'taskflow_remember';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;

// Priority color map
export const PRIORITY_CLASS = {
  LOW:    'priority-low',
  MEDIUM: 'priority-medium',
  HIGH:   'priority-high',
  URGENT: 'priority-urgent',
};

// Status color map
export const STATUS_CLASS = {
  TODO:        'status-todo',
  IN_PROGRESS: 'status-progress',
  COMPLETED:   'status-completed',
};

// Status display labels
export const STATUS_LABEL = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED:   'Completed',
};

// Priority display labels
export const PRIORITY_LABEL = {
  LOW:    'Low',
  MEDIUM: 'Medium',
  HIGH:   'High',
  URGENT: 'Urgent',
};

// Chart colors
export const CHART_COLORS = {
  primary:  '#4F46E5',
  green:    '#22c55e',
  yellow:   '#f59e0b',
  red:      '#ef4444',
  purple:   '#a855f7',
  blue:     '#3b82f6',
  orange:   '#f97316',
  teal:     '#14b8a6',
};

// Nav items (matched per role in sidebar)
export const NAV_ITEMS = [
  { label: 'Dashboard',  path: '/',           icon: 'LayoutDashboard' },
  { label: 'Tasks',      path: '/tasks',       icon: 'CheckSquare'     },
  { label: 'Kanban',     path: '/kanban',      icon: 'Columns'         },
  { label: 'Calendar',   path: '/calendar',    icon: 'Calendar'        },
  { label: 'Analytics',  path: '/analytics',   icon: 'BarChart2', role: 'ADMIN' },
  { label: 'Team',       path: '/team',        icon: 'Users'           },
  { label: 'Profile',    path: '/profile',     icon: 'User'            },
  { label: 'Settings',   path: '/settings',    icon: 'Settings'        },
];
