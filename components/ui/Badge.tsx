import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'dark' | 'glow';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variants: Record<string, string> = {
      default: 'bg-white/5 text-gray-300 border border-white/10',
      primary: 'bg-primary-500/15 text-primary-300 border border-primary-500/20',
      secondary: 'bg-secondary-500/15 text-secondary-300 border border-secondary-500/20',
      success: 'bg-green-500/15 text-green-300 border border-green-500/20',
      warning: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20',
      error: 'bg-red-500/15 text-red-300 border border-red-500/20',
      outline: 'border border-gray-600 text-gray-300 bg-transparent',
      dark: 'bg-white text-gray-900',
      glow: 'bg-primary-500/15 text-primary-300 border border-primary-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]',
    };

    const sizes: Record<string, string> = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
