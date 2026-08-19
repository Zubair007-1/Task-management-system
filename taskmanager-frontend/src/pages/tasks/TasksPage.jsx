import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Download, Upload, Trash2,
  CheckSquare, ChevronUp, ChevronDown, Eye, Edit2, MoreHorizontal,
} from 'lucide-react';
import { useTasks, useDeleteTask, useBulkDelete, useBulkComplete } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { SkeletonRow } from '../../components/ui/Skeleton';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import TaskModal from '../../components/tasks/TaskModal';
import TaskDrawer from '../../components/tasks/TaskDrawer';
import { exportCsv } from '../../utils/exportCsv';
import { STATUSES, PRIORITIES } from '../../utils/constants';
import { cn } from '../../utils/cn';

const PAGE_SIZE = 10;

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronUp className="w-3 h-3 text-slate-300" />;
  return sortDir === 'asc'
    ? <ChevronUp   className="w-3 h-3 text-primary-600" />
    : <ChevronDown className="w-3 h-3 text-primary-600" />;
}

const COLUMNS = [
  { key: 'title',    label: 'Title',    sortable: true  },
  { key: 'priority', label: 'Priority', sortable: true  },
  { key: 'status',   label: 'Status',   sortable: true  },
  { key: 'actions',  label: '',         sortable: false },
];

export default function TasksPage() {
  const { isAdmin } = useAuth();
  const { data: tasks = [], isLoading } = useTasks();
  const deleteTask    = useDeleteTask();
  const bulkDelete    = useBulkDelete();
  const bulkComplete  = useBulkComplete();

  const [searchParams, setSearchParams] = useSearchParams();

  const [search,    setSearch]    = useState(searchParams.get('search') || '');
  const [status,    setStatus]    = useState('');
  const [priority,  setPriority]  = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDir,   setSortDir]   = useState('asc');
  const [page,      setPage]      = useState(0);
  const [selected,  setSelected]  = useState([]);

  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTask,   setEditTask]   = useState(null);
  const [drawerTask, setDrawerTask] = useState(null);

  // Reset page on filter change
  useEffect(() => { setPage(0); setSelected([]); }, [search, status, priority]);

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search)   list = list.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()));
    if (status)   list = list.filter(t => t.status === status);
    if (priority) list = list.filter(t => t.priority === priority);
    list.sort((a, b) => {
      const av = (a[sortField] || '').toLowerCase();
      const bv = (b[sortField] || '').toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [tasks, search, status, priority, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleSelectAll = () =>
    setSelected(prev => prev.length === paged.length ? [] : paged.map(t => t.id));

  const handleEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const handleView = (task) => setDrawerTask(task);

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selected.length} task(s)?`)) {
      await bulkDelete.mutateAsync(selected);
      setSelected([]);
    }
  };

  const handleBulkComplete = async () => {
    await bulkComplete.mutateAsync({ ids: selected, tasks });
    setSelected([]);
  };

  const handleExport = () => {
    exportCsv(
      filtered.map(t => ({ ID: t.id, Title: t.title, Description: t.description, Priority: t.priority, Status: t.status })),
      'taskflow-tasks'
    );
  };

  const clearFilters = () => { setSearch(''); setStatus(''); setPriority(''); };
  const hasFilters = search || status || priority;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {filtered.length} task{filtered.length !== 1 ? 's' : ''}{hasFilters ? ' found' : ' total'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} size="sm" onClick={handleExport} id="export-csv-btn">
            Export CSV
          </Button>
          <Button icon={Plus} onClick={() => { setEditTask(null); setModalOpen(true); }} id="add-task-btn">
            New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="input pl-9"
              id="task-search"
            />
          </div>

          <Select
            options={[{ value: '', label: 'All Statuses' }, ...STATUSES.map(s => ({ value: s, label: s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase() }))]}
            value={status}
            onChange={e => setStatus(e.target.value)}
            placeholder={null}
            className="w-40"
            id="status-filter"
          />

          <Select
            options={[{ value: '', label: 'All Priorities' }, ...PRIORITIES.map(p => ({ value: p, label: p.charAt(0) + p.slice(1).toLowerCase() }))]}
            value={priority}
            onChange={e => setPriority(e.target.value)}
            placeholder={null}
            className="w-40"
            id="priority-filter"
          />

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} id="clear-filters-btn">
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="card px-4 py-3 flex items-center gap-4 border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20"
          >
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {selected.length} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="secondary" size="sm" icon={CheckSquare} onClick={handleBulkComplete} id="bulk-complete-btn">
                Mark Complete
              </Button>
              {isAdmin && (
                <Button variant="danger" size="sm" icon={Trash2} onClick={handleBulkDelete} id="bulk-delete-btn">
                  Delete
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="tasks-table">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && selected.length === paged.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    aria-label="Select all"
                  />
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap',
                      col.sortable && 'cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none'
                    )}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <span className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                : paged.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="py-2">
                        <EmptyState
                          type={hasFilters ? 'search' : 'tasks'}
                          title={hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
                          description={hasFilters ? 'Try adjusting your search or filters.' : 'Create your first task to get started.'}
                          action={!hasFilters ? () => setModalOpen(true) : null}
                          actionLabel="Create Task"
                        />
                      </td>
                    </tr>
                  )
                  : paged.map((task, idx) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className={cn(
                        'border-b border-slate-100 dark:border-slate-700/50 last:border-0',
                        'hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors',
                        selected.includes(task.id) && 'bg-primary-50/50 dark:bg-primary-900/10'
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(task.id)}
                          onChange={() => toggleSelect(task.id)}
                          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          aria-label={`Select ${task.title}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleView(task)}
                          className="text-left font-medium text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1 max-w-xs"
                        >
                          {task.title}
                        </button>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                      </td>
                      <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                      <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => handleView(task)}
                            className="btn btn-ghost p-1.5 rounded-lg text-slate-500 hover:text-primary-600"
                            title="View details"
                            aria-label="View task"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(task)}
                            className="btn btn-ghost p-1.5 rounded-lg text-slate-500 hover:text-amber-600"
                            title="Edit task"
                            aria-label="Edit task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete "${task.title}"?`)) {
                                  await deleteTask.mutateAsync(task.id);
                                }
                              }}
                              className="btn btn-ghost p-1.5 rounded-lg text-slate-500 hover:text-red-600"
                              title="Delete task"
                              aria-label="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700/50">
            <span className="text-xs text-slate-500">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        task={editTask}
      />

      <TaskDrawer
        task={drawerTask}
        open={!!drawerTask}
        onClose={() => setDrawerTask(null)}
        onEdit={handleEdit}
      />
    </div>
  );
}
