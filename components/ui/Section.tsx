import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'muted' | 'primary' | 'secondary' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  as?: 'section' | 'div' | 'main' | 'footer' | 'header';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', size = 'lg', as: Component = 'section', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-neutral-950',
      muted: 'bg-neutral-50 dark:bg-neutral-900',
      primary: 'bg-primary-600 text-white',
      secondary: 'bg-secondary-600 text-white',
      dark: 'bg-neutral-900 dark:bg-black',
    };

    const sizes = {
      sm: 'py-12',
      md: 'py-16',
      lg: 'py-20',
      xl: 'py-24',
    };

    return (
      <Component
        ref={ref as React.RefObject<HTMLElement>}
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
