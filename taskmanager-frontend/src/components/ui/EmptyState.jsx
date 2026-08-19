import { motion } from 'framer-motion';
import Button from './Button';
import { Plus, SearchX, FolderOpen, AlertTriangle } from 'lucide-react';

const illustrations = {
  tasks:  <FolderOpen className="w-20 h-20 text-slate-300 dark:text-slate-600" />,
  search: <SearchX className="w-20 h-20 text-slate-300 dark:text-slate-600" />,
  error:  <AlertTriangle className="w-20 h-20 text-amber-300" />,
};

export default function EmptyState({
  type = 'tasks',
  title = 'Nothing here yet',
  description = 'Get started by creating your first item.',
  action,
  actionLabel = 'Create',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div className="mb-6 animate-bounce-subtle">
        {illustrations[type] || illustrations.tasks}
      </div>
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action} icon={Plus}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
