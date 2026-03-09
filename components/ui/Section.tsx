import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'muted' | 'primary' | 'secondary' | 'dark' | 'surface';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  as?: 'section' | 'div' | 'main' | 'footer' | 'header';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', size = 'lg', as: Component = 'section', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[rgb(var(--background-primary))]',
      muted: 'bg-[rgb(var(--background-secondary))]',
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-violet-600 text-white',
      dark: 'bg-[rgb(var(--background-tertiary))]',
      surface: 'bg-[rgb(var(--surface-2))]',
    };

    const sizes = {
      sm: 'py-12',
      md: 'py-16',
      lg: 'py-20',
      xl: 'py-24',
    };

    return (
      <Component
        ref={ref}
        className={cn(variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Section.displayName = 'Section';

export { Section };
