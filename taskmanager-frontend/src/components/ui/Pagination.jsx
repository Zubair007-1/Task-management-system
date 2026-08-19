import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Pagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  const showEllipsis = totalPages > 7;

  const getVisiblePages = () => {
    if (!showEllipsis) return pages;
    if (page < 4) return [...pages.slice(0, 5), '...', totalPages - 1];
    if (page > totalPages - 5) return [0, '...', ...pages.slice(totalPages - 5)];
    return [0, '...', page - 1, page, page + 1, '...', totalPages - 1];
  };

  return (
    <div className={cn('flex items-center gap-1', className)} aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="btn btn-ghost btn-sm p-1.5 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getVisiblePages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'btn btn-sm min-w-[2rem] rounded-lg font-medium',
              p === page
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'btn-ghost text-slate-600 dark:text-slate-400'
            )}
            aria-label={`Page ${p + 1}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="btn btn-ghost btn-sm p-1.5 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
