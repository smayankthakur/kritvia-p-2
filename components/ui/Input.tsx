import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'bg-[rgb(var(--surface-2))] border-[rgb(var(--border-primary))]',
            'text-gray-100',
            'placeholder:text-gray-500',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[rgb(var(--border-primary))] hover:border-[rgb(var(--border-secondary))]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-400">{helperText}</p>}
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
            'w-full px-4 py-3 rounded-xl border transition-colors duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'bg-[rgb(var(--surface-2))] border-[rgb(var(--border-primary))]',
            'text-gray-100',
            'placeholder:text-gray-500',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[rgb(var(--border-primary))] hover:border-[rgb(var(--border-secondary))]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
