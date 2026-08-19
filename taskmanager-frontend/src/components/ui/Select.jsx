import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select…', className, wrapperClassName, ...props },
  ref
) {
  return (
    <div className={cn('w-full', wrapperClassName)}>
      {label && <label className="form-label">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'input appearance-none pr-10 cursor-pointer',
            error && 'input-error',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) =>
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )
          )}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});

export default Select;
