// Validações e máscaras para o sistema OptiLog

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// ============ MÁSCARAS DE ENTRADA ============

export const masks = {
  // Máscara para telefone: (XX) XXXXX-XXXX
  phone: (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  },

  // Máscara para CNH: XXXXXXXXXXX (11 dígitos)
  cnh: (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 11);
  },

  // Máscara para placa (formato antigo): XXX-XXXX
  plateOld: (value: string): string => {
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (clean.length <= 3) return clean;
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}`;
  },

  // Máscara para placa (formato Mercosul): XXXXXXX
  plateMercosul: (value: string): string => {
    return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 7);
  },

  // Máscara inteligente para placa (detecta formato)
  plate: (value: string): string => {
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Se tem 7 caracteres e segue padrão Mercosul (XXX0X00)
    if (clean.length === 7 && /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean)) {
      return clean; // Formato Mercosul
    }
    
    // Formato antigo com hífen
    if (clean.length <= 3) return clean;
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}`;
  }
};

// ============ VALIDAÇÕES ============

export const validators = {
  // Validação de telefone brasileiro
  phone: (phone: string): ValidationResult => {
    const numbers = phone.replace(/\D/g, '');
    
    if (!numbers) {
      return { isValid: false, error: 'Telefone é obrigatório' };
    }
    
    if (numbers.length < 10) {
      return { isValid: false, error: 'Telefone deve ter pelo menos 10 dígitos' };
    }
    
    if (numbers.length > 11) {
      return { isValid: false, error: 'Telefone deve ter no máximo 11 dígitos' };
    }
    
    // Validação básica de DDD (11-99)
    const ddd = parseInt(numbers.slice(0, 2));
    if (ddd < 11 || ddd > 99) {
      return { isValid: false, error: 'DDD inválido' };
    }
    
    return { isValid: true };
  },

  // Validação de CNH
  cnh: (cnh: string): ValidationResult => {
    const numbers = cnh.replace(/\D/g, '');
    
    if (!numbers) {
      return { isValid: false, error: 'CNH é obrigatória' };
    }
    
    if (numbers.length !== 11) {
      return { isValid: false, error: 'CNH deve ter exatamente 11 dígitos' };
    }
    
    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(numbers)) {
      return { isValid: false, error: 'CNH inválida' };
    }
    
    // Algoritmo de validação da CNH
    let sum = 0;
    let factor = 9;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * factor--;
    }
    
    let checkDigit1 = sum % 11;
    if (checkDigit1 >= 2) {
      checkDigit1 = 11 - checkDigit1;
    } else {
      checkDigit1 = 0;
    }
    
    sum = 0;
    factor = 1;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * factor++;
    }
    
    sum += checkDigit1 * 2;
    let checkDigit2 = sum % 11;
    
    if (checkDigit2 >= 2) {
      checkDigit2 = 11 - checkDigit2;
    } else {
      checkDigit2 = 0;
    }
    
    if (parseInt(numbers[9]) !== checkDigit1 || parseInt(numbers[10]) !== checkDigit2) {
      return { isValid: false, error: 'CNH inválida' };
    }
    
    return { isValid: true };
  },

  // Validação de placa
  plate: (plate: string): ValidationResult => {
    if (!plate) {
      return { isValid: false, error: 'Placa é obrigatória' };
    }
    
    const clean = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    if (clean.length < 7) {
      return { isValid: false, error: 'Placa deve ter 7 caracteres' };
    }
    
    // Formato antigo: ABC1234
    const oldFormat = /^[A-Z]{3}[0-9]{4}$/;
    // Formato Mercosul: ABC1D23
    const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    
    if (!oldFormat.test(clean) && !mercosulFormat.test(clean)) {
      return { isValid: false, error: 'Formato de placa inválido' };
    }
    
    return { isValid: true };
  },

  // Validação de nome
  name: (name: string): ValidationResult => {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'Nome é obrigatório' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    }
    
    if (name.trim().length > 100) {
      return { isValid: false, error: 'Nome deve ter no máximo 100 caracteres' };
    }
    
    // Verifica se contém apenas letras, espaços e acentos
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
      return { isValid: false, error: 'Nome deve conter apenas letras e espaços' };
    }
    
    return { isValid: true };
  },

  // Validação de marca de veículo
  brand: (brand: string): ValidationResult => {
    if (!brand || brand.trim().length === 0) {
      return { isValid: false, error: 'Marca é obrigatória' };
    }
    
    if (brand.trim().length < 2) {
      return { isValid: false, error: 'Marca deve ter pelo menos 2 caracteres' };
    }
    
    if (brand.trim().length > 50) {
      return { isValid: false, error: 'Marca deve ter no máximo 50 caracteres' };
    }
    
    return { isValid: true };
  },

  // Validação de modelo de veículo
  model: (model: string): ValidationResult => {
    if (!model || model.trim().length === 0) {
      return { isValid: false, error: 'Modelo é obrigatório' };
    }
    
    if (model.trim().length < 2) {
      return { isValid: false, error: 'Modelo deve ter pelo menos 2 caracteres' };
    }
    
    if (model.trim().length > 50) {
      return { isValid: false, error: 'Modelo deve ter no máximo 50 caracteres' };
    }
    
    return { isValid: true };
  }
};

// ============ UTILITÁRIOS ============

export const formatters = {
  // Remove formatação e retorna apenas números
  onlyNumbers: (value: string): string => {
    return value.replace(/\D/g, '');
  },

  // Remove formatação e retorna apenas letras e números
  onlyAlphanumeric: (value: string): string => {
    return value.replace(/[^A-Za-z0-9]/g, '');
  },

  // Capitaliza primeira letra de cada palavra
  capitalize: (value: string): string => {
    return value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  },

  // Formata telefone para exibição
  displayPhone: (phone: string): string => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return phone;
  },

  // Formata placa para exibição
  displayPlate: (plate: string): string => {
    const clean = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Formato Mercosul
    if (clean.length === 7 && /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean)) {
      return clean;
    }
    
    // Formato antigo
    if (clean.length === 7) {
      return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    }
    
    return plate.toUpperCase();
  }
};

// ============ VALIDAÇÃO COMPLETA DE FORMULÁRIOS ============

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateDriverForm = (data: {
  name: string;
  cnh: string;
  phone: string;
}): FormValidationResult => {
  const errors: Record<string, string> = {};
  
  const nameValidation = validators.name(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  const cnhValidation = validators.cnh(data.cnh);
  if (!cnhValidation.isValid) {
    errors.cnh = cnhValidation.error!;
  }
  
  const phoneValidation = validators.phone(data.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateVehicleForm = (data: {
  plate: string;
  brand: string;
  model: string;
}): FormValidationResult => {
  const errors: Record<string, string> = {};
  
  const plateValidation = validators.plate(data.plate);
  if (!plateValidation.isValid) {
    errors.plate = plateValidation.error!;
  }
  
  const brandValidation = validators.brand(data.brand);
  if (!brandValidation.isValid) {
    errors.brand = brandValidation.error!;
  }
  
  const modelValidation = validators.model(data.model);
  if (!modelValidation.isValid) {
    errors.model = modelValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};