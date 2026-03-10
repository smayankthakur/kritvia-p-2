import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'muted' | 'primary' | 'secondary' | 'dark' | 'surface';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  as?: 'section' | 'div' | 'main' | 'footer' | 'header';
}

export function Section({
  className,
  variant = 'default',
  size = 'lg',
  as: Component = 'section',
  children,
  ...props
}: SectionProps) {
  const variants: Record<string, string> = {
    default: 'bg-[rgb(var(--background-primary))]',
    muted: 'bg-[rgb(var(--background-secondary))]',
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-violet-600 text-white',
    dark: 'bg-[rgb(var(--background-tertiary))]',
    surface: 'bg-[rgb(var(--surface-2))]',
  };

  const sizes: Record<string, string> = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-24',
    '2xl': 'py-32',
  };

  return (
    <Component
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
