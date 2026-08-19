import { cn } from '../../utils/cn';

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const colorMap = [
  'bg-violet-500', 'bg-indigo-500', 'bg-blue-500', 'bg-cyan-500',
  'bg-teal-500',  'bg-green-500',  'bg-yellow-500','bg-orange-500',
  'bg-red-500',   'bg-pink-500',
];

function getColor(name = '') {
  const idx = name.charCodeAt(0) % colorMap.length;
  return colorMap[idx];
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

export default function Avatar({ name = '', src, size = 'md', className, online }) {
  const sizeClass  = sizeMap[size] || sizeMap.md;
  const colorClass = getColor(name);
  const initials   = getInitials(name);

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover ring-2 ring-white dark:ring-slate-800', sizeClass)}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-slate-800',
            sizeClass,
            colorClass
          )}
          aria-label={name}
        >
          {initials || '?'}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-800',
            online ? 'bg-green-500' : 'bg-slate-400'
          )}
        />
      )}
    </div>
  );
}
