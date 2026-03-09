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

    const variants = {
      default: 'bg-gray-800 text-gray-200',
      primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      secondary: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
      success: 'bg-green-500/20 text-green-300 border border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      error: 'bg-red-500/20 text-red-300 border border-red-500/30',
      outline: 'border border-gray-600 text-gray-300',
      dark: 'bg-white text-gray-900',
      glow: 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    };

    const sizes = {
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
