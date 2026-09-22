// Harvested from: https://ui.shadcn.com/docs/components/button & https://beui.dev/r/button
// Re-expressed on semantic tokens

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_MAP: Record<ButtonVariant, string> = {
  primary:
    'bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 border border-amber-500/80 shadow-sm active:bg-amber-600',
  destructive:
    'bg-rose-600 text-white font-semibold hover:bg-rose-500 border border-rose-700 shadow-sm active:bg-rose-700',
  outline:
    'border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white active:bg-slate-900',
  secondary:
    'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700/80 active:bg-slate-800',
  ghost:
    'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 active:bg-slate-800',
  link:
    'text-amber-400 underline-offset-4 hover:underline p-0 h-auto font-normal',
};

const SIZE_MAP: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2 text-xs font-mono',
  sm: 'h-7 px-2.5 text-[11px] font-mono rounded',
  lg: 'h-11 px-6 text-sm font-mono rounded-lg',
  icon: 'size-9 p-0 rounded-md',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md transition-all duration-150 select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d16]',
          'disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed',
          'active:scale-[0.98]',
          VARIANT_MAP[variant],
          SIZE_MAP[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="size-3.5 animate-spin text-current" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
