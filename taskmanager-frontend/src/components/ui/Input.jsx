import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    type = 'text',
    className,
    wrapperClassName,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('w-full', wrapperClassName)}>
      {label && (
        <label className="form-label">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'input',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {error && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
            <AlertCircle className="w-4 h-4" />
          </span>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
});

export default Input;
