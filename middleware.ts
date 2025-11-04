import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Rotas públicas que não precisam de autenticação
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/_next',
  '/favicon.ico',
  '/api/auth',
  '/api/service-orders', // Temporário para testes
  '/api/cte',
  '/api/customers',
  '/api/export',
  '/api/fuel-supplies',
  '/api/maintenances',
  '/api/vehicle-alerts',
  '/api/vehicles',
  '/api/trips', // App Motorista
  '/motorista', // App Motorista PWA
  '/manifest.json',
  '/service-worker.js',
  '/offline.html',
  '/icons',
];

// Mapeamento de rotas para roles permitidos
const routePermissions: Record<string, string[]> = {
  '/supergestor': ['super_gestor'],
  '/admin': ['super_gestor', 'administrador'],
  '/financeiro': ['super_gestor', 'administrador', 'financeiro'],
  '/operacoes': ['super_gestor', 'administrador', 'operador_logistico'],
  '/motorista': ['super_gestor', 'administrador', 'operador_logistico', 'motorista'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite acesso a recursos estáticos e rotas públicas
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') || 
    publicRoutes.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // Verifica o token JWT
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    // Verifica o token usando a chave secreta
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
    const { payload } = await jwtVerify(token, secret);
    
    // Redirect automático por role após autenticação
    if (pathname === '/' || pathname === '/dashboard') {
      const role = payload.role as string;
      
      if (role === 'driver') {
        return NextResponse.redirect(new URL('/motorista', request.url));
      }
      if (role === 'mechanic') {
        return NextResponse.redirect(new URL('/mechanic', request.url));
      }
      // Admin e Manager continuam no /dashboard
    }
    
    // Verifica permissões baseadas nos roles do usuário
    // O payload pode ter um array 'roles' ou um único 'role', priorizamos 'roles'
    const userRoles = (payload.roles as string[]) || (payload.role ? [payload.role as string] : ['usuario']);
    return verifyAccess(request, userRoles);
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return redirectToLogin(request);
  }
}

function verifyAccess(request: NextRequest, roles: string[]) {
  const { pathname } = request.nextUrl;

  // Verifica permissões para rotas protegidas
  for (const [route, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route) && !roles.some((role) => allowedRoles.includes(role))) {
      return new NextResponse(null, {
        status: 403,
        statusText: 'Forbidden',
      });
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}
