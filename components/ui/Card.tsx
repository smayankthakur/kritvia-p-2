import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'glow';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl';

    const variants = {
      default: 'bg-[rgb(var(--card-background))] border border-[rgb(var(--card-border))] shadow-lg shadow-black/5',
      bordered: 'bg-[rgb(var(--card-background))] border border-[rgb(var(--card-border))]',
      elevated: 'bg-[rgb(var(--card-background))] border border-[rgb(var(--card-border))] shadow-xl shadow-black/10',
      glass: 'bg-[rgb(var(--glass-background))] backdrop-blur-xl border border-[rgb(var(--glass-border))]',
      glow: 'bg-[rgb(var(--card-background))] border border-[rgb(var(--card-border))] hover:shadow-[0_0_30px_rgba(var(--glow-blue),0.3)] transition-all duration-300',
    };

    const hoverStyles = hover ? 'transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 cursor-pointer' : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
