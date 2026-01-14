# Deployment Scripts

This folder contains deployment/ops scripts for the Optilog app.

## ⚠️ SECURITY WARNING: Never Commit Hardcoded Credentials!

**CRITICAL:** Never hardcode API keys, database passwords, or other secrets in scripts. Always use environment variables.

### ❌ WRONG (Hardcoded Secrets)
```javascript
// NEVER DO THIS!
const supabaseUrl = 'https://eixkvksttadhukucohda.supabase.co'
const supabaseKey = 'eyJhbGc...' // This will fail Netlify security scan!
const dbPassword = 'mypassword123' // Exposed in git history forever!
```

### ✅ CORRECT (Environment Variables)
```javascript
// Always use process.env for sensitive data
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const dbPassword = process.env.DATABASE_PASSWORD

// Always validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Required Supabase environment variables not configured')
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}
```

## How to Use Scripts with External Services

### 1. Configure Environment Variables

**For local development:**
```bash
# Create a .env.local file (already gitignored)
export VITE_SUPABASE_URL="your-supabase-url"
export VITE_SUPABASE_ANON_KEY="your-anon-key"
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
export DATABASE_URL="your-database-connection-string"
```

**For Netlify/CI:**
- Go to: Site Settings → Build & Deploy → Environment Variables
- Add all required variables there

### 2. Template for Database/API Scripts

```javascript
// scripts/your-script.cjs (or .js/.mjs)
require('dotenv').config({ path: '.env.local' })

// External service clients (Supabase example)
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:')
  console.error('  - VITE_SUPABASE_URL')
  console.error('  - VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  // Your script logic here
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
    process.exit(1)
  }
  
  console.log('Data:', data)
}

main().catch(console.error)
```

### 3. Protected Script Patterns

The following script patterns are automatically gitignored to prevent accidental commits:
- `scripts/fix-*.{cjs,js,mjs}`
- `scripts/test-*.{cjs,js,mjs}`
- `scripts/update-*.{cjs,js,mjs}`
- `scripts/*-user.{cjs,js,mjs}`
- `scripts/check-schema.{cjs,js,mjs}`

If you create scripts matching these patterns, they will NOT be committed to git. This is intentional to prevent credential leaks.

## Deployment Scripts

### deploy_final_aggressive.ps1

A PowerShell script that orchestrates local boot of all services with:

- Port killing (to avoid conflicts)
- Dependency install (npm/yarn/pip)
- Parallel start for Next.js, Backend, Tire-Ops, ML and Streamlit
- Health checks with retries
- Detailed logging to `deploy_final_aggressive.log`

Quick start (PowerShell from repo root):

```
pwsh -NoProfile -ExecutionPolicy Bypass -File ".\scripts\deploy_final_aggressive.ps1" -FullResetDb
```

Flags:

- `-FullResetDb`: runs a full DB reset routine if available, then starts services

Logs:

- Main log at `c:\Users\Pichau\devoptilog-app\deploy_final_aggressive.log`

Notes:

- If Streamlit is used, ensure Python and dependencies are installed
- For custom ports, adapt the script variables inside as needed

## Legacy scripts

Older scripts like `deploy_full_ultra.ps1` and `setup_full_ultra.ps1` remain for reference and may be deprecated in favor of `deploy_final_aggressive.ps1`.

## Security Checklist for Scripts

Before committing any new script:

- [ ] No hardcoded URLs containing sensitive data
- [ ] No API keys or tokens in plain text
- [ ] No database passwords or connection strings
- [ ] All secrets loaded from `process.env`
- [ ] Proper error handling when env vars are missing
- [ ] Script follows naming patterns (avoid patterns in .gitignore if it needs to be committed)

## What to Do If You Accidentally Commit Secrets

1. **Immediately rotate the exposed credentials** (regenerate API keys, change passwords)
2. Update environment variables in all deployment environments
3. Remove the secret from git history using tools like `git-filter-repo` or BFG Repo-Cleaner
4. Force push the cleaned history (coordinate with team first!)

## References

- [Supabase Security Best Practices](https://supabase.com/docs/guides/api/api-keys)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [GitHub Secrets Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
