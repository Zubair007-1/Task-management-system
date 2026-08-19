import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d, yyyy');
  } catch {
    return '—';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d, yyyy · h:mm a');
  } catch {
    return '—';
  }
};

export const formatRelative = (date) => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
};

export const isOverdue = (date) => {
  if (!date) return false;
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isPast(d) && !isToday(d);
  } catch {
    return false;
  }
};

export const isDueToday = (date) => {
  if (!date) return false;
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isToday(d);
  } catch {
    return false;
  }
};

export const isDueTomorrow = (date) => {
  if (!date) return false;
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isTomorrow(d);
  } catch {
    return false;
  }
};

export const formatMonthYear = (date) => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMMM yyyy');
  } catch {
    return '';
  }
};
