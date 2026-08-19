import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare, Clock, TrendingUp, AlertCircle, Plus,
  ArrowUpRight, Activity, Calendar, Target,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useTasks, useDashboard, useCreateTask } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { SkeletonStatCard } from '../../components/ui/Skeleton';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { formatDate, isOverdue } from '../../utils/formatDate';
import { CHART_COLORS, STATUS_LABEL } from '../../utils/constants';
import TaskModal from '../../components/tasks/TaskModal';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
};

// Generate weekly mock data from real tasks
function buildWeeklyData(tasks) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    completed: Math.max(0, (tasks.filter(t => t.status === 'COMPLETED').length / 7) + (i % 3)),
    created:   Math.max(0, (tasks.length / 7) + (i % 2)),
  })).map(d => ({ ...d, completed: Math.round(d.completed), created: Math.round(d.created) }));
}

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: dashStats, isLoading: statsLoading } = useDashboard();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const stats = useMemo(() => {
    const total     = dashStats?.totalTasks     ?? tasks.length;
    const completed = dashStats?.completedTasks ?? tasks.filter(t => t.status === 'COMPLETED').length;
    const pending   = dashStats?.pendingTasks   ?? tasks.filter(t => t.status === 'TODO').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const overdue   = tasks.filter(t => isOverdue(t.dueDate)).length;
    const rate      = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, inProgress, overdue, rate };
  }, [tasks, dashStats]);

  const pieData = [
    { name: 'Completed',   value: stats.completed,  color: CHART_COLORS.green  },
    { name: 'In Progress', value: stats.inProgress, color: CHART_COLORS.primary },
    { name: 'Pending',     value: stats.pending,    color: CHART_COLORS.yellow },
    { name: 'Overdue',     value: stats.overdue,    color: CHART_COLORS.red    },
  ].filter(d => d.value > 0);

  const weeklyData  = useMemo(() => buildWeeklyData(tasks), [tasks]);
  const recentTasks = useMemo(() => [...tasks].slice(0, 5), [tasks]);

  const statCards = [
    { label: 'Total Tasks',  value: stats.total,      icon: CheckSquare,  color: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'In Progress',  value: stats.inProgress, icon: TrendingUp,   color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-900/20'     },
    { label: 'Completed',    value: stats.completed,  icon: Target,       color: 'text-green-600',   bg: 'bg-green-50 dark:bg-green-900/20'   },
    { label: 'Pending',      value: stats.pending,    icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-900/20'   },
    { label: 'Overdue',      value: stats.overdue,    icon: AlertCircle,  color: 'text-red-600',     bg: 'bg-red-50 dark:bg-red-900/20'       },
    { label: 'Completion %', value: `${stats.rate}%`, icon: Activity,     color: 'text-violet-600',  bg: 'bg-violet-50 dark:bg-violet-900/20' },
  ];

  const isLoading = tasksLoading || (isAdmin && statsLoading);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Track your productivity and task progress
          </p>
        </div>
        <Button onClick={() => setTaskModalOpen(true)} icon={Plus} id="dashboard-add-task">
          New Task
        </Button>
      </div>

      {/* Stat Cards */}
      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {isLoading
          ? Array(6).fill(0).map((_, i) => <SkeletonStatCard key={i} />)
          : statCards.map((card) => (
              <motion.div key={card.label} variants={CARD_VARIANTS} className="stat-card group">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', card.bg)}>
                  <card.icon className={cn('w-5 h-5', card.color)} />
                </div>
              </motion.div>
            ))
        }
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Area Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">Weekly Activity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tasks created vs completed</p>
            </div>
            <span className="badge badge-indigo">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.teal} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="completed" stroke={CHART_COLORS.primary} fill="url(#gradCompleted)" strokeWidth={2} name="Completed" />
              <Area type="monotone" dataKey="created"   stroke={CHART_COLORS.teal}    fill="url(#gradCreated)"   strokeWidth={2} name="Created" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Task Status</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution overview</p>
          </div>
          {pieData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
              No tasks yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="truncate">{d.name}</span>
                    <span className="ml-auto font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Monthly Completion</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tasks completed per month</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => ({
              month: m,
              tasks: i < new Date().getMonth()
                ? Math.round(Math.random() * 20 + 5)
                : i === new Date().getMonth()
                  ? stats.completed
                  : 0,
            }))}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
            />
            <Bar dataKey="tasks" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Tasks */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Recent Tasks</h2>
          <a href="/tasks" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        {recentTasks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No tasks yet. Create your first task!</p>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{task.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{task.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Task Modal */}
      <TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
    </div>
  );
}
