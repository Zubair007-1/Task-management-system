import { cn } from '../../utils/cn';
import { PRIORITY_CLASS, STATUS_CLASS, PRIORITY_LABEL, STATUS_LABEL } from '../../utils/constants';

export function PriorityBadge({ priority }) {
  if (!priority) return null;
  return (
    <span className={cn('badge', PRIORITY_CLASS[priority] || 'badge-slate')}>
      {PRIORITY_LABEL[priority] || priority}
    </span>
  );
}

export function StatusBadge({ status }) {
  if (!status) return null;
  return (
    <span className={cn('badge', STATUS_CLASS[status] || 'badge-slate')}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export function Badge({ children, variant = 'slate', className }) {
  const variantMap = {
    indigo:  'badge-indigo',
    green:   'badge-green',
    yellow:  'badge-yellow',
    red:     'badge-red',
    slate:   'badge-slate',
    orange:  'badge-orange',
  };
  return (
    <span className={cn('badge', variantMap[variant] || 'badge-slate', className)}>
      {children}
    </span>
  );
}

export default Badge;
