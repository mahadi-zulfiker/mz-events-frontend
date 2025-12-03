import { cn } from '@/lib/utils';
import * as React from 'react';

type BadgeVariant = 'default' | 'outline' | 'success' | 'warning' | 'destructive';

const badgeClasses: Record<BadgeVariant, string> = {
  default: 'bg-white/10 border border-white/10 text-white',
  outline: 'border border-white/20 text-slate-100',
  success: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100',
  warning: 'bg-amber-500/20 border border-amber-500/30 text-amber-100',
  destructive: 'bg-rose-500/20 border border-rose-500/30 text-rose-100',
};

export const Badge = ({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
      badgeClasses[variant],
      className
    )}
    {...props}
  />
);
