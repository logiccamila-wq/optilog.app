# Security Fix: Netlify Secrets Scanner Configuration

## Overview

This document describes the security improvements made to prevent Netlify build failures caused by the secrets scanner detecting sensitive keys in the codebase.

## Problem

Netlify's security scanner was detecting `VITE_SUPABASE_ANON_KEY` in:
- Scripts that may have had hardcoded credentials
- Production bundle files (expected, as this is a public key)

The build was failing because Netlify treats all secrets as sensitive by default, even public keys that are safe to expose client-side.

## Solution Implemented

### 1. Created `netlify.toml` Configuration ✅

Created `/netlify.toml` with:
```toml
[build.environment]
  SECRETS_SCAN_OMIT_KEYS = "VITE_SUPABASE_ANON_KEY,NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

This tells Netlify's secrets scanner to allow these specific keys in the build output, as they are **public keys** designed for client-side use.

**Why this is safe:**
- Supabase Anon Keys are intended for public exposure
- They have Row Level Security (RLS) policies to protect data
- They cannot perform admin operations (that requires service_role_key)

### 2. Updated `.gitignore` ✅

Added protection for potentially sensitive script files:
```gitignore
# Scripts that might accidentally contain credentials
scripts/fix-*.cjs
scripts/test-*.cjs
scripts/update-*.cjs
scripts/*-user.cjs
scripts/check-schema.cjs
```

This prevents accidentally committing development/utility scripts that might contain hardcoded credentials.

### 3. Enhanced `scripts/README.md` ✅

Created comprehensive security documentation including:
- ❌ Examples of what NOT to do (hardcoded secrets)
- ✅ Examples of correct usage (environment variables)
- Templates for secure script development
- Security checklist for new scripts
- Instructions for environment variable configuration

### 4. Verified No Hardcoded Secrets ✅

Audited the codebase and confirmed:
- No JWT tokens or API keys hardcoded in scripts
- All Supabase configuration uses `process.env`
- The only Supabase reference is a public project ID (safe)

## Files Changed

1. ✅ Created `/netlify.toml` - Netlify build configuration
2. ✅ Updated `/.gitignore` - Added script file protections
3. ✅ Updated `/scripts/README.md` - Security best practices
4. ✅ Updated `/js/main.js` - Made Supabase ref use env var (optional)
5. ✅ Created `/SECURITY_FIX.md` - This documentation

## Configuration Required

### Netlify Environment Variables

Ensure these variables are set in Netlify Dashboard:
1. Go to: **Site Settings → Build & Deploy → Environment Variables**
2. Add/verify:
   - `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Any other required environment variables

### Local Development

Create `.env.local` file (already gitignored):
```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## ⚠️ Post-Merge Actions (IMPORTANT)

### IF Secrets Were Previously Committed

If hardcoded secrets existed in git history before this fix:

1. **Rotate Supabase Keys** (CRITICAL):
   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
   - Click "Generate new anon key"
   - If service_role_key was exposed: **Rotate IMMEDIATELY** (this is admin key!)
   - Update the new keys in Netlify environment variables

2. **Clean Git History** (Optional but Recommended):
   ```bash
   # Using BFG Repo-Cleaner (recommended)
   # Install from: https://rtyley.github.io/bfg-repo-cleaner/
   
   # Create a file with secrets to remove
   echo "your-old-secret-key" > secrets.txt
   
   # Clean the repository
   bfg --replace-text secrets.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # Force push (coordinate with team!)
   git push --force
   ```

3. **Verify Build**:
   - Trigger a new Netlify build
   - Confirm it passes without secrets scanner errors
   - Check that the application works correctly

## Testing the Fix

### 1. Local Build Test
```bash
npm run build
```
Should complete without errors.

### 2. Netlify Build Test
Push to the branch connected to Netlify and verify:
- ✅ Build completes successfully
- ✅ No secrets scanner errors
- ✅ Application loads and functions correctly

### 3. Environment Variable Test
```bash
# Test that env vars are properly loaded
node -e "console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

## Security Best Practices Going Forward

1. **Never hardcode secrets** in any file committed to git
2. **Always use environment variables** for sensitive data
3. **Review scripts** before committing (check against patterns in .gitignore)
4. **Use .env.local** for local development (already gitignored)
5. **Rotate keys immediately** if accidentally committed
6. **Enable GitHub secret scanning** alerts (if available)

## References

- [Netlify Secrets Scanning Documentation](https://ntl.fyi/configure-secrets-scanning)
- [Supabase API Keys Documentation](https://supabase.com/docs/guides/api/api-keys)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

## Questions?

If you encounter issues:
1. Check that all environment variables are properly set
2. Verify `netlify.toml` is in the repository root
3. Review Netlify build logs for specific error messages
4. Ensure no new secrets have been accidentally committed

---

**Status:** ✅ Implemented and ready for deployment
**Date:** 2026-01-14
**Priority:** HIGH (Security Fix)
