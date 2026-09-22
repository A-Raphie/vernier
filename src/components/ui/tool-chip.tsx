// Harvested from: https://beautifului.dev#tool-chips & https://coss.com/ui
// Re-expressed on semantic tokens

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ToolChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string | number;
  status?: 'active' | 'blocked' | 'idle' | 'warning';
}

const STATUS_MAP = {
  active: 'bg-emerald-400',
  blocked: 'bg-rose-500',
  idle: 'bg-slate-400',
  warning: 'bg-amber-400',
};

export const ToolChip: React.FC<ToolChipProps> = ({
  label,
  value,
  status = 'idle',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-800 bg-[#090d16] font-mono text-[11px] text-slate-300 select-none',
        className,
      )}
      {...props}
    >
      <span className={cn('size-1.5 rounded-full shrink-0', STATUS_MAP[status])} />
      <span className="text-slate-400 uppercase text-[10px]">{label}</span>
      {value !== undefined && (
        <span className="text-slate-200 font-semibold">{value}</span>
      )}
    </div>
  );
};
