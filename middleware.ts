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

// Mapeamento de rotas para roles permitidos (RBAC)
const routePermissions: Record<string, string[]> = {
  '/usuarios': ['admin'], // Apenas admins podem gerenciar usuários
  '/supergestor': ['admin'],
  '/admin': ['admin'],
  '/financeiro': ['admin', 'manager'],
  '/finance': ['admin', 'manager'],
  '/operacoes': ['admin', 'manager', 'operator'],
  '/motorista': ['admin', 'driver'], // Motoristas acessam seu portal
  '/mechanic': ['admin', 'mechanic'], // Mecânicos acessam seu portal
  '/dashboard/operational': ['admin', 'operator'], // Dashboard operacional
  '/control-tower': ['admin', 'manager', 'operator'],
  '/bi': ['admin', 'manager'],
  '/relatorios': ['admin', 'manager'],
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
    
    // Verifica permissões baseadas no role do usuário
    const userRole = payload.role as string || 'viewer';
    const userRoles = [userRole]; // Compatibilidade
    
    // Redirecionar após login baseado no role
    if (pathname === '/' || pathname === '/login') {
      return redirectBasedOnRole(request, userRole);
    }
    
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

function redirectBasedOnRole(request: NextRequest, role: string) {
  const url = request.nextUrl.clone();
  
  switch (role) {
    case 'admin':
    case 'manager':
      url.pathname = '/dashboard';
      break;
    case 'driver':
      url.pathname = '/motorista';
      break;
    case 'mechanic':
      url.pathname = '/mechanic';
      break;
    case 'operator':
      url.pathname = '/dashboard/operational';
      break;
    default:
      url.pathname = '/dashboard';
  }
  
  return NextResponse.redirect(url);
}
