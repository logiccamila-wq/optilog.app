import { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Variante visual do card */
  variant?: 'default' | 'outlined' | 'elevated';
  
  /** Padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /** Efeito hover (elevação) */
  hover?: boolean;
  
  /** Conteúdo do card */
  children: ReactNode;
}

/**
 * Componente Card padronizado do Design System
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg" hover>
 *   <h3>Título</h3>
 *   <p>Conteúdo do card</p>
 * </Card>
 * ```
 */
export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  className = '',
  ...props
}: CardProps) {
  // Classes base
  const baseClasses = 'rounded-xl transition-all duration-250';

  // Classes de variante
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-transparent border-2 border-gray-300',
    elevated: 'bg-white shadow-lg',
  };

  // Classes de padding
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Classes de hover
  const hoverClasses = hover
    ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer'
    : '';

  // Combinar todas as classes
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

export default Card;