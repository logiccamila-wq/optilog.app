import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, roles } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });
    }

    // Cria token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
    const token = await new SignJWT({ 
      email, 
      role,
      roles: roles || ['usuario']
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Token válido por 7 dias
      .sign(secret);

    // Cria resposta com cookie
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Erro ao criar cookie de autenticação:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
