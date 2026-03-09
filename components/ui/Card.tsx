import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'glow';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl';

    const variants = {
      default: 'bg-white dark:bg-[rgb(var(--card-background))] shadow-soft dark:shadow-none border border-transparent dark:border-[rgb(var(--card-border))]',
      bordered: 'bg-white dark:bg-[rgb(var(--card-background))] border border-neutral-200 dark:border-[rgb(var(--card-border))]',
      elevated: 'bg-white dark:bg-[rgb(var(--card-background))] shadow-medium dark:shadow-none border border-transparent dark:border-[rgb(var(--card-border))]',
      glass: 'bg-white/80 dark:bg-[rgb(var(--glass-background))] backdrop-blur-xl border border-neutral-200/50 dark:border-[rgb(var(--glass-border))]',
      glow: 'bg-white dark:bg-[rgb(var(--card-background))] border border-transparent dark:border-[rgb(var(--card-border))] dark:hover:shadow-[0_0_30px_rgba(var(--glow-color),0.3)] transition-all duration-300',
    };

    const hoverStyles = hover ? 'transition-all duration-300 hover:shadow-medium dark:hover:shadow-[0_0_30px_rgba(var(--glow-color),0.2)] hover:border-primary-300 dark:hover:border-[rgb(var(--accent-primary))] cursor-pointer' : '';

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
