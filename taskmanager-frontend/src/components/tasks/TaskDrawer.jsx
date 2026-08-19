import { motion } from 'framer-motion';
import Drawer from '../ui/Drawer';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { Edit2, Trash2, Calendar, Tag, AlignLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDeleteTask } from '../../hooks/useTasks';

export default function TaskDrawer({ task, open, onClose, onEdit }) {
  const { isAdmin } = useAuth();
  const deleteTask = useDeleteTask();

  if (!task) return null;

  const handleDelete = async () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      await deleteTask.mutateAsync(task.id);
      onClose();
    }
  };

  const fields = [
    { icon: Tag,        label: 'Priority', value: <PriorityBadge priority={task.priority} /> },
    { icon: AlignLeft,  label: 'Status',   value: <StatusBadge status={task.status} />      },
    { icon: Calendar,   label: 'Due Date', value: <span className="text-sm text-slate-600 dark:text-slate-400">Not set</span> },
  ];

  return (
    <Drawer open={open} onClose={onClose} title="Task Details" width="w-[440px]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-snug">
            {task.title}
          </h2>
        </div>

        {/* Metadata fields */}
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                <f.icon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{f.label}</p>
                {f.value}
              </div>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* Description */}
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Description
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="divider" />

        {/* Activity placeholder */}
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Activity
          </p>
          <div className="space-y-3">
            {['Task created', 'Status changed to ' + (task.status || 'TODO')].map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400">{event}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={Edit2}
            onClick={() => { onClose(); onEdit(task); }}
            className="flex-1"
            id="drawer-edit-btn"
          >
            Edit Task
          </Button>
          {isAdmin && (
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDelete}
              loading={deleteTask.isPending}
              id="drawer-delete-btn"
            >
              Delete
            </Button>
          )}
        </div>
      </motion.div>
    </Drawer>
  );
}
