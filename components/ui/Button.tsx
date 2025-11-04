import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { DESIGN_SYSTEM } from '@/lib/theme/design-system';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual do botão */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg';
  
  /** Exibe estado de loading */
  isLoading?: boolean;
  
  /** Ocupa 100% da largura */
  fullWidth?: boolean;
  
  /** Ícone no início */
  startIcon?: ReactNode;
  
  /** Ícone no final */
  endIcon?: ReactNode;
}

/**
 * Componente Button padronizado do Design System
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Criar Usuário
 * </Button>
 * 
 * <Button variant="outline" isLoading={loading}>
 *   Salvando...
 * </Button>
 * 
 * <Button variant="danger" startIcon={<DeleteIcon />}> 
 *   Excluir
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Classes base
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

    // Classes de variante
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
      secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800',
      outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
    };

    // Classes de tamanho
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };

    // Classes de largura
    const widthClass = fullWidth ? 'w-full' : '';

    // Combinar todas as classes
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

    // Spinner de loading
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          startIcon && <span className="inline-flex">{startIcon}</span>
        )}
        {children}
        {!isLoading && endIcon && <span className="inline-flex">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;