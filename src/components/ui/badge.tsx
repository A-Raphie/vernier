// Harvested from: https://coss.com/ui/docs/components/badge & https://ui.shadcn.com/docs/components/badge
// Re-expressed on semantic tokens

import * as React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'default' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  dotPulse?: boolean;
}

const BADGE_VARIANTS: Record<BadgeVariant, { container: string; dot: string }> = {
  default: {
    container: 'border-slate-700 bg-slate-800/80 text-slate-200',
    dot: 'bg-slate-400',
  },
  secondary: {
    container: 'border-[#1e293b] bg-[#0e131f] text-slate-300',
    dot: 'bg-slate-400',
  },
  destructive: {
    container: 'border-rose-800/80 bg-rose-950/60 text-rose-300',
    dot: 'bg-rose-500',
  },
  success: {
    container: 'border-emerald-800/80 bg-emerald-950/60 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  warning: {
    container: 'border-amber-700/80 bg-amber-950/60 text-amber-300',
    dot: 'bg-amber-400',
  },
  info: {
    container: 'border-cyan-800 bg-cyan-950/60 text-cyan-300',
    dot: 'bg-cyan-400',
  },
  outline: {
    container: 'border-slate-700 text-slate-300 bg-transparent',
    dot: 'bg-slate-400',
  },
};

const BADGE_SIZES: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  default: 'px-2 py-0.5 text-[11px]',
  lg: 'px-2.5 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'default',
  dot = false,
  dotPulse = false,
  children,
  ...props
}) => {
  const current = BADGE_VARIANTS[variant];
  const sizeClasses = BADGE_SIZES[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-mono font-medium border select-none transition-colors',
        current.container,
        sizeClasses,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'size-1.5 rounded-full shrink-0',
            current.dot,
            dotPulse && 'animate-pulse',
          )}
        />
      )}
      <span>{children}</span>
    </div>
  );
};
