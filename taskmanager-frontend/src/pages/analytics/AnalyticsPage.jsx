import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { useTasks } from '../../hooks/useTasks';
import { exportCsv } from '../../utils/exportCsv';
import Button from '../../components/ui/Button';
import { CHART_COLORS } from '../../utils/constants';

export default function AnalyticsPage() {
  const { data: tasks = [], isLoading } = useTasks();

  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;

    const high = tasks.filter((t) => t.priority === 'HIGH' || t.priority === 'URGENT').length;
    const medium = tasks.filter((t) => t.priority === 'MEDIUM').length;
    const low = tasks.filter((t) => t.priority === 'LOW').length;

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, todo, high, medium, low, rate };
  }, [tasks]);

  // Priority distribution chart data
  const priorityData = [
    { name: 'High/Urgent', value: metrics.high, color: CHART_COLORS.red },
    { name: 'Medium', value: metrics.medium, color: CHART_COLORS.yellow },
    { name: 'Low', value: metrics.low, color: CHART_COLORS.green },
  ].filter(d => d.value > 0);

  // Status breakdown data
  const statusData = [
    { name: 'Todo', value: metrics.todo },
    { name: 'In Progress', value: metrics.inProgress },
    { name: 'Completed', value: metrics.completed },
  ];

  // Productivity trend (mocked based on actual task counts)
  const trendData = [
    { name: 'Week 1', completed: Math.max(1, Math.round(metrics.completed * 0.2)), active: Math.round(metrics.total * 0.4) },
    { name: 'Week 2', completed: Math.max(2, Math.round(metrics.completed * 0.5)), active: Math.round(metrics.total * 0.6) },
    { name: 'Week 3', completed: Math.max(3, Math.round(metrics.completed * 0.8)), active: Math.round(metrics.total * 0.8) },
    { name: 'Week 4', completed: metrics.completed, active: metrics.total },
  ];

  // Mock Radar categories breakdown
  const categoryData = [
    { subject: 'Development', A: 85, fullMark: 100 },
    { subject: 'Design', A: 70, fullMark: 100 },
    { subject: 'Marketing', A: 60, fullMark: 100 },
    { subject: 'Research', A: 90, fullMark: 100 },
    { subject: 'QA/Testing', A: 50, fullMark: 100 },
  ];

  const downloadReport = () => {
    const reportData = [
      { Metric: 'Total Tasks', Value: metrics.total },
      { Metric: 'Completed Tasks', Value: metrics.completed },
      { Metric: 'In Progress Tasks', Value: metrics.inProgress },
      { Metric: 'Todo Tasks', Value: metrics.todo },
      { Metric: 'Completion Rate (%)', Value: `${metrics.rate}%` },
      { Metric: 'High/Urgent Priority', Value: metrics.high },
      { Metric: 'Medium Priority', Value: metrics.medium },
      { Metric: 'Low Priority', Value: metrics.low },
    ];
    exportCsv(reportData, 'taskflow-analytics-report');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deep dive into project execution performance metrics
          </p>
        </div>
        <Button variant="outline" icon={Download} onClick={downloadReport}>
          Download Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate', value: `${metrics.rate}%`, desc: 'Ratio of finished tasks' },
          { label: 'Total Tasks Active', value: metrics.total, desc: 'Overall workload volume' },
          { label: 'Pending Execution', value: metrics.todo + metrics.inProgress, desc: 'Tasks still unfinished' },
          { label: 'High Priority Load', value: metrics.high, desc: 'Critical action items' },
        ].map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c.label}</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{c.value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity trend */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Workload & Completion Trend</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cumulative task metrics over month duration</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="completed" stroke={CHART_COLORS.green} fill="url(#colorCompleted)" strokeWidth={2.5} name="Completed Tasks" />
              <Line type="monotone" dataKey="active" stroke={CHART_COLORS.primary} strokeWidth={2.5} name="Total Workload" />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Priority distribution */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Priority Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Workload share grouped by priority weight</p>
          </div>
          {priorityData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">
              No tasks to analyze
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-[260px]">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={4}>
                      {priorityData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 w-1/2">
                {priorityData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                      <span>{d.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Breakdown Bar Chart */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Status Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Task quantities in each execution status stage</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} name="Task Count">
                <Cell fill={CHART_COLORS.yellow} />
                <Cell fill={CHART_COLORS.primary} />
                <Cell fill={CHART_COLORS.green} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories radar chart */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Task Categories Performance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Completion efficiency percentages across departments</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={categoryData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Performance" dataKey="A" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.15} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
