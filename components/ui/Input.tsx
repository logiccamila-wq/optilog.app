import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, startIcon, endIcon, fullWidth = false, className = '', required, disabled, id, ...props }, ref) => {
    const hasError = Boolean(error);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const containerClasses = fullWidth ? 'w-full' : 'w-auto';
    const baseInputClasses = 'block w-full rounded-lg border px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50';
    const stateClasses = hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
    const iconPaddingClasses = startIcon ? 'pl-10' : endIcon ? 'pr-10' : '';
    const inputClasses = `${baseInputClasses} ${stateClasses} ${iconPaddingClasses} ${className}`;

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="ml-1 text-red-500" aria-label="obrigatório">*</span>}
          </label>
        )}
        <div className="relative">
          {startIcon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{startIcon}</div>}
          <input id={inputId} ref={ref} className={inputClasses} disabled={disabled} aria-invalid={hasError} aria-required={required} aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined} {...props} />
          {endIcon && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">{endIcon}</div>}
          {hasError && !endIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
          )}
        </div>
        {error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>}
        {helperText && !error && <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;