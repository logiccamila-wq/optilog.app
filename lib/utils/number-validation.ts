/**
 * Utilitário de validação e conversão segura de números
 * Previne erros como ".toFixed() is not a function"
 */

/**
 * Converte qualquer valor para número de forma segura
 * @param value - Valor a ser convertido
 * @param defaultValue - Valor padrão caso a conversão falhe
 * @returns Número válido ou valor padrão
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  // Se já é um número válido, retorna
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }
  
  // Tenta converter string para número
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed;
    }
  }
  
  // Retorna valor padrão para null, undefined, ou conversão falhou
  return defaultValue;
}

/**
 * Aplica .toFixed() de forma segura
 * @param value - Valor a ser formatado
 * @param decimals - Número de casas decimais
 * @returns String formatada com decimais
 */
export function safeToFixed(value: any, decimals: number = 2): string {
  return safeNumber(value).toFixed(decimals);
}

/**
 * Soma array de valores de forma segura
 * @param values - Array de valores a serem somados
 * @returns Soma total
 */
export function safeSum(values: any[]): number {
  if (!Array.isArray(values)) {
    return 0;
  }
  
  return values
    .map(v => safeNumber(v))
    .reduce((acc, v) => acc + v, 0);
}

/**
 * Calcula média de array de valores de forma segura
 * @param values - Array de valores
 * @returns Média ou 0 se array vazio
 */
export function safeAverage(values: any[]): number {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }
  
  const sum = safeSum(values);
  return sum / values.length;
}

/**
 * Calcula percentual de forma segura
 * @param value - Valor parcial
 * @param total - Valor total
 * @param defaultValue - Valor padrão se total for 0
 * @returns Percentual (0-100)
 */
export function safePercentage(value: any, total: any, defaultValue: number = 0): number {
  const numValue = safeNumber(value);
  const numTotal = safeNumber(total);
  
  if (numTotal === 0) {
    return defaultValue;
  }
  
  return (numValue / numTotal) * 100;
}

/**
 * Formata valor monetário de forma segura
 * @param value - Valor a ser formatado
 * @param currency - Símbolo da moeda
 * @param decimals - Casas decimais
 * @returns String formatada com moeda
 */
export function safeCurrency(value: any, currency: string = 'R$', decimals: number = 2): string {
  return `${currency} ${safeToFixed(value, decimals)}`;
}

/**
 * Multiplica valores de forma segura
 * @param values - Valores a serem multiplicados
 * @returns Produto
 */
export function safeMultiply(...values: any[]): number {
  if (values.length === 0) {
    return 0;
  }
  
  return values.reduce((acc, v) => acc * safeNumber(v, 1), 1);
}

/**
 * Divide valores de forma segura (evita divisão por zero)
 * @param dividend - Dividendo
 * @param divisor - Divisor
 * @param defaultValue - Valor padrão se divisor for 0
 * @returns Resultado da divisão
 */
export function safeDivide(dividend: any, divisor: any, defaultValue: number = 0): number {
  const numDividend = safeNumber(dividend);
  const numDivisor = safeNumber(divisor);
  
  if (numDivisor === 0) {
    return defaultValue;
  }
  
  return numDividend / numDivisor;
}
