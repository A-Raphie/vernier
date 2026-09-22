// Harvested from: https://beui.dev/r/tabs & https://ui.shadcn.com/docs/components/tabs
// Re-expressed on semantic tokens

import * as React from 'react';
import { cn } from '../../lib/utils';

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-[#1e293b] bg-[#0e131f] p-1 text-slate-400 select-none',
        className,
      )}
      {...props}
    />
  ),
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, active = false, icon, badge, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded px-3 py-1 text-xs font-mono transition-all duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400',
        active
          ? 'bg-[#1e293b] text-white font-medium shadow-sm'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge && (
        <span
          className={cn(
            'text-[9px] px-1 py-0.2 rounded font-mono uppercase tracking-wider',
            active
              ? 'bg-slate-700/60 text-slate-200 border border-slate-600/60'
              : 'bg-slate-800 text-slate-400',
          )}
        >
          {badge}
        </span>
      )}
    </button>
  ),
);
TabsTrigger.displayName = 'TabsTrigger';
