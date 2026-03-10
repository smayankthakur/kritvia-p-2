import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'glow';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    hover = false, 
    padding = 'md',
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'rounded-2xl';

    const variants: Record<string, string> = {
      default: 'bg-[rgb(var(--card-background))] border border-[rgb(var(--card-border))] shadow-lg shadow-black/5',
      bordered: 'bg-transparent border border-[rgb(var(--card-border))]',
      elevated: 'bg-[rgb(var(--card-background))] border border-[rgb(var(--card-border))] shadow-xl shadow-black/10',
      glass: 'bg-[rgb(var(--glass-background))] backdrop-blur-xl border border-[rgb(var(--glass-border))]',
      glow: 'bg-[rgb(var(--card-background))] border border-[rgb(var(--card-border))] hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-primary-500/30 transition-all duration-300',
    };

    const paddingSizes: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hover 
      ? 'transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-500/20 hover:-translate-y-1 cursor-pointer' 
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddingSizes[padding], hoverStyles, className)}
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
    <div 
      ref={ref} 
      className={cn('pb-4', className)} 
      {...props} 
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn('', className)} 
      {...props} 
    />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn('pt-4 mt-4 border-t border-[rgb(var(--border-primary))]', className)} 
      {...props} 
    />
  )
);

CardFooter.displayName = 'CardFooter';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold text-white', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-400 mt-1', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
