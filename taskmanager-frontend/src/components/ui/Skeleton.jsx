import { cn } from '../../utils/cn';

/** Single skeleton block */
export function Skeleton({ className }) {
  return (
    <div className={cn('shimmer rounded-xl bg-slate-100 dark:bg-slate-700', className)} />
  );
}

/** Shimmer card for task list rows */
export function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700/50">
      <td className="px-4 py-3"><Skeleton className="h-4 w-4 rounded" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
      <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
      <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
      <td className="px-4 py-3"><Skeleton className="h-8 w-20 rounded-lg" /></td>
    </tr>
  );
}

/** Shimmer card for dashboard stat cards */
export function SkeletonStatCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/** Shimmer card for kanban cards */
export function SkeletonKanbanCard() {
  return (
    <div className="card p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** Generic shimmer card */
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === 0 ? 'w-3/4' : i % 2 === 0 ? 'w-full' : 'w-2/3')}
        />
      ))}
    </div>
  );
}
