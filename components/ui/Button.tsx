import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'dark' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40',
      secondary: 'bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/40',
      outline: 'border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 focus:ring-blue-500 bg-transparent hover:border-blue-400',
      ghost: 'text-gray-300 hover:bg-gray-800 focus:ring-gray-500',
      link: 'text-blue-400 hover:text-blue-300 hover:underline p-0',
      dark: 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
      gradient: 'bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700 shadow-lg hover:shadow-blue-500/25 hover:shadow-violet-500/25',
    };

    const sizes = {
      sm: 'text-sm px-4 py-2 rounded-lg',
      md: 'text-base px-5 py-2.5 rounded-lg',
      lg: 'text-lg px-7 py-3.5 rounded-xl',
      xl: 'text-xl px-10 py-4 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
