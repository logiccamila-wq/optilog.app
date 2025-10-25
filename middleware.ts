import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { sql } from '@vercel/postgres';

// Rotas públicas que não precisam de autenticação
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/_next',
  '/favicon.ico',
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

  // Permitir rotas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // Verificar token JWT
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return redirectToLogin(request);
    }

    // Verificar token com Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Buscar usuário no banco
    const userResult = await sql`
      SELECT role, active 
      FROM users 
      WHERE firebase_uid = ${firebaseUid}
      AND active = true
    `;

    if (userResult.rowCount === 0) {
      return redirectToLogin(request);
    }

    const user = userResult.rows[0];

    // Verificar se o usuário tem permissão para a rota
    if (pathname in routePermissions) {
      const allowedRoles = routePermissions[pathname];
      if (!allowedRoles.includes(user.role)) {
        return new NextResponse(JSON.stringify({ 
          error: 'Acesso não autorizado' 
        }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Registrar acesso
    await sql`
      INSERT INTO access_logs (
        user_id,
        module,
        action,
        ip_address,
        user_agent,
        success
      ) VALUES (
        ${user.id},
        ${pathname},
        'access',
        ${request.ip || ''},
        ${request.headers.get('user-agent') || ''},
        true
      )
    `;

    // Adicionar informações do usuário ao cabeçalho da requisição
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Role', user.role);
    requestHeaders.set('X-User-Id', user.id);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    console.error('Erro no middleware:', error);
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL('/login', request.url));
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. Matches any path starting with:
     *    - api (API routes)
     *    - _next/static (static files)
     *    - _next/image (image optimization files)
     *    - favicon.ico (favicon file)
     *    - public folder
     * 2. Matches public routes configured above
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|login|signup|forgot-password|reset-password).*)',
  ],
};