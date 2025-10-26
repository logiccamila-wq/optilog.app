// API client para operações CRUD com Neon Postgres
// Usa REST API do Neon para operações de dados

const NEON_REST_URL = process.env.NEXT_PUBLIC_NEON_REST_URL || '';
const NEON_API_KEY = process.env.NEXT_PUBLIC_NEON_API_KEY || '';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class NeonClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = NEON_REST_URL;
    this.apiKey = NEON_API_KEY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (!this.baseUrl) {
      return {
        success: false,
        error: 'Neon REST URL não configurado. Configure NEXT_PUBLIC_NEON_REST_URL',
      };
    }

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'apikey': this.apiKey }),
        ...options.headers,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // GET - listar registros
  async list<T>(table: string, filters?: Record<string, any>): Promise<ApiResponse<T[]>> {
    const params = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request<T[]>(`/${table}${params}`, { method: 'GET' });
  }

  // GET - obter registro por ID
  async get<T>(table: string, id: string | number): Promise<ApiResponse<T>> {
    return this.request<T>(`/${table}/${id}`, { method: 'GET' });
  }

  // POST - criar registro
  async create<T>(table: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.request<T>(`/${table}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PATCH - atualizar registro
  async update<T>(table: string, id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.request<T>(`/${table}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE - remover registro
  async delete(table: string, id: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/${table}/${id}`, { method: 'DELETE' });
  }
}

export const neonClient = new NeonClient();

// Tipos para entidades principais
export interface Order {
  id: number;
  customer_name: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  driver_name?: string;
  status: 'available' | 'in_use' | 'maintenance';
  last_location?: string;
  created_at: string;
}

export interface FinanceEntry {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  warehouse_location?: string;
  created_at: string;
  updated_at: string;
}
