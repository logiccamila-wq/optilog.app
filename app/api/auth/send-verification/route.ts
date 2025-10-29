import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to send email verification
 * TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
 * TODO: Get user email from session/token
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Get user from session
    // const user = await getCurrentUser(request);
    
    // TODO: Send verification email
    // await sendVerificationEmail(user.email);
    
    // For now, return success (stub)
    console.log('Email verification request received');
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Email de verificação enviado com sucesso' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro ao enviar email de verificação' 
      },
      { status: 500 }
    );
  }
}
