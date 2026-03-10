import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftElement, rightElement, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 rounded-xl border transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
              'bg-[rgb(var(--surface-2))] border-[rgb(var(--border-primary))]',
              'text-white',
              'placeholder:text-gray-500',
              leftElement && 'pl-11',
              rightElement && 'pr-11',
              error
                ? 'border-red-500 focus:ring-red-500/50'
                : 'hover:border-[rgb(var(--border-secondary))]',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
            'bg-[rgb(var(--surface-2))] border-[rgb(var(--border-primary))]',
            'text-white',
            'placeholder:text-gray-500',
            error
              ? 'border-red-500 focus:ring-red-500/50'
              : 'hover:border-[rgb(var(--border-secondary))]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
