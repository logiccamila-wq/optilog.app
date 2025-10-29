# First Login Flow - Integration Guide

This document explains how to integrate the first-login authentication flow with your authentication provider.

## Overview

The first-login flow consists of three pages that new users must complete:

1. **Terms Acceptance** (`/first-login`) - Accept Terms of Use and Privacy Policy
2. **Email Verification** (`/verify-email`) - Verify email address
3. **Force Password Change** (`/force-password`) - Create a secure password

## Current Implementation

The current implementation uses **localStorage** for state management and **stub API routes** that return success responses. This is suitable for development and testing but should be replaced with server-side session management for production.

## Integration with Stack Auth

### 1. Email Verification

Update `/app/api/auth/send-verification/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stackAuth } from '@/lib/stackAuth';

export async function POST(request: NextRequest) {
  try {
    // Get user from session/token
    const user = stackAuth.getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }
    
    // Send verification email through Stack Auth
    // Note: Stack Auth API may differ - adjust as needed
    await sendStackAuthVerificationEmail(user.email);
    
    return NextResponse.json(
      { success: true, message: 'Email de verificação enviado com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao enviar email de verificação' },
      { status: 500 }
    );
  }
}
```

### 2. Password Change

Update `/app/api/auth/change-password/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stackAuth } from '@/lib/stackAuth';

export async function POST(request: NextRequest) {
  try {
    const { newPassword } = await request.json();
    
    // Validation (already implemented)
    // ... existing validation code ...
    
    // Get current user
    const user = stackAuth.getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }
    
    // Update password through Stack Auth
    // Note: Stack Auth API may differ - adjust as needed
    await updateStackAuthPassword(user.id, newPassword);
    
    return NextResponse.json(
      { success: true, message: 'Senha atualizada com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao atualizar senha' },
      { status: 500 }
    );
  }
}
```

## Integration with Supabase

### 1. Email Verification

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }
    
    // Supabase automatically sends verification on signup
    // To resend, use:
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: session.user.email!,
    });
    
    if (error) throw error;
    
    return NextResponse.json(
      { success: true, message: 'Email de verificação enviado' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 2. Password Change

```typescript
export async function POST(request: NextRequest) {
  try {
    const { newPassword } = await request.json();
    
    // Validation code...
    
    // Update password through Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    
    return NextResponse.json(
      { success: true, message: 'Senha atualizada com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

## Session Management

Replace localStorage with server-side session management:

### 1. Create a session endpoint

```typescript
// app/api/auth/session/route.ts
export async function GET(request: NextRequest) {
  // Check if user has completed first login
  const user = await getCurrentUser(request);
  const profile = await getUserProfile(user.id);
  
  return NextResponse.json({
    user,
    firstLoginCompleted: profile.first_login_completed,
    emailVerified: profile.email_verified,
    passwordUpdated: profile.password_updated,
  });
}

export async function POST(request: NextRequest) {
  // Update first login status
  const { firstLoginCompleted, emailVerified, passwordUpdated } = await request.json();
  const user = await getCurrentUser(request);
  
  await updateUserProfile(user.id, {
    first_login_completed: firstLoginCompleted,
    email_verified: emailVerified,
    password_updated: passwordUpdated,
  });
  
  return NextResponse.json({ success: true });
}
```

### 2. Update the pages to use session API

In `/app/(auth)/first-login/page.tsx`:

```typescript
const handleAccept = async () => {
  if (!canProceed) return;

  // Save to database instead of localStorage
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstLoginCompleted: true,
      termsAccepted: true,
      privacyAccepted: true,
      marketingConsent: marketingAccepted,
    }),
  });

  router.push('/verify-email');
};
```

## Middleware Protection

Update the middleware to check server-side session:

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // ... existing code ...
  
  // Check if user needs first-login flow
  const session = await getSession(request);
  
  if (session && !session.firstLoginCompleted) {
    // User is authenticated but hasn't completed first login
    const { pathname } = request.nextUrl;
    
    // Allow access to first-login flow pages
    const firstLoginPages = ['/first-login', '/verify-email', '/force-password'];
    if (firstLoginPages.some(page => pathname.startsWith(page))) {
      return NextResponse.next();
    }
    
    // Redirect to first-login for all other pages
    return NextResponse.redirect(new URL('/first-login', request.url));
  }
  
  // ... rest of middleware ...
}
```

## Email Service Integration

Choose an email service provider and configure:

### SendGrid Example

```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  const msg = {
    to: email,
    from: 'no-reply@optilog.app',
    subject: 'Verifique seu e-mail - Optilog',
    html: `
      <h1>Verificação de E-mail</h1>
      <p>Clique no link abaixo para verificar seu e-mail:</p>
      <a href="${verificationUrl}">Verificar E-mail</a>
    `,
  };
  
  await sgMail.send(msg);
}
```

## Database Schema

Add fields to your user profile table:

```sql
ALTER TABLE user_profiles ADD COLUMN first_login_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN password_updated BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN marketing_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN terms_accepted_at TIMESTAMP;
ALTER TABLE user_profiles ADD COLUMN privacy_accepted_at TIMESTAMP;
```

## Testing

1. Clear localStorage: `localStorage.clear()`
2. Login with a new account
3. Verify redirect to `/first-login`
4. Complete the flow and verify redirect to `/dashboard`
5. Logout and login again - should go directly to dashboard

## Environment Variables

Add to `.env.local`:

```bash
# Email Service (SendGrid example)
SENDGRID_API_KEY=your_sendgrid_api_key

# Verification URL base
NEXT_PUBLIC_VERIFICATION_URL_BASE=https://your-app.com

# Stack Auth (if using)
NEXT_PUBLIC_STACK_AUTH_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_AUTH_JWKS_URL=your_jwks_url

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Support

For questions or issues, refer to:
- Stack Auth documentation: https://docs.stack-auth.com
- Supabase Auth documentation: https://supabase.com/docs/guides/auth
- SendGrid documentation: https://docs.sendgrid.com
