import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';

const variantClasses: Record<Variant, string> = {
  default:
    'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110 focus:ring-indigo-200',
  outline:
    'border border-white/20 text-slate-100 hover:bg-white/10 focus:ring-indigo-200',
  ghost: 'text-slate-100 hover:bg-white/10 focus:ring-indigo-200',
  destructive: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200',
  secondary:
    'bg-white text-slate-900 hover:bg-slate-100 focus:ring-indigo-200',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', loading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
          variantClasses[variant],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? 'Please wait...' : children}
      </button>
    );
  }
);
Button.displayName = 'Button';
