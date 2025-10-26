# CI/CD and Firebase Deploy Setup

This document explains how to configure and use the GitHub Actions workflows for Continuous Integration (CI) and Firebase deployment in the optilog.app monorepo.

## Overview

The repository includes two main workflows:

1. **`.github/workflows/ci.yml`** - Continuous Integration workflow that runs on all pushes and pull requests
2. **`.github/workflows/firebase-deploy.yml`** - Firebase deployment workflow for production (main) and preview (PRs)

## Prerequisites

- GitHub repository with Actions enabled
- Firebase project created ([Firebase Console](https://console.firebase.google.com/))
- Node.js 20.x installed locally for testing
- Firebase CLI installed: `npm install -g firebase-tools`

## Required Repository Secrets

The workflows require the following secrets to be configured in your GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

### 1. `FIREBASE_SERVICE_ACCOUNT`

A JSON key for a Firebase service account with deployment permissions.

**How to obtain:**

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project
2. Navigate to **Project Settings** (gear icon) → **Service Accounts**
3. Click **Generate New Private Key**
4. Download the JSON file
5. Copy the **entire contents** of the JSON file
6. In GitHub repository settings, create a new secret named `FIREBASE_SERVICE_ACCOUNT`
7. Paste the JSON content as the secret value

**Example format (DO NOT use these values):**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### 2. `FIREBASE_PROJECT`

Your Firebase project ID (found in Firebase Console → Project Settings).

**Example:** `optilog-prod` or `your-project-id`

### 3. `FIREBASE_TOKEN` (Optional but recommended for Functions)

A Firebase CI token for deploying Firebase Functions.

**How to obtain:**

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login:ci`
3. Follow the browser authentication flow
4. Copy the token displayed in the terminal
5. Add it as a GitHub secret named `FIREBASE_TOKEN`

**Note:** The service account JSON should be sufficient for most deployments, but some operations may require the token.

## Workflow Details

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` and feature branches (`feature/**`, `fix/**`, `chore/**`)
- Pull requests to `main`

**Steps:**
1. Checkout code
2. Setup Node.js 20 with npm caching
3. Install dependencies (root, backend, functions)
4. Run linter (`npm run lint`)
5. Build frontend (`npm run build`)
6. Build backend (if build script exists)
7. Run Playwright E2E tests
8. Upload artifacts (test reports, build outputs)

**Notes:**
- Some steps use `continue-on-error: true` to handle pre-existing build issues
- Artifacts are retained for 3-7 days for debugging

### Firebase Deploy Workflow (`.github/workflows/firebase-deploy.yml`)

**Triggers:**
- **Production Deploy:** Push to `main` branch
- **Preview Deploy:** Pull requests to `main` (optional)

**Steps:**
1. Checkout code with pinned commit SHA for security
2. Setup Node.js 20 with npm caching
3. Install dependencies across monorepo
4. Build frontend and backend
5. Deploy to Firebase Hosting (live channel for production, preview for PRs)
6. Deploy Firebase Functions (production only, if present)
7. Generate deployment summary

**Security Features:**
- Actions pinned to specific commit SHAs
- Secrets not exposed to forked repositories
- Service account JSON cleaned up after use
- No concurrent production deploys

## Post-Merge Checklist

After merging the PR that adds these workflows, complete the following:

- [ ] Add `FIREBASE_SERVICE_ACCOUNT` secret to repository
  - Generate service account JSON from Firebase Console
  - Add as GitHub Actions secret
- [ ] Add `FIREBASE_PROJECT` secret to repository
  - Find project ID in Firebase Console → Project Settings
  - Add as GitHub Actions secret
- [ ] (Optional) Add `FIREBASE_TOKEN` secret for Functions deployment
  - Run `firebase login:ci` locally
  - Add token as GitHub Actions secret
- [ ] Verify `package.json` scripts exist:
  - [ ] `npm run build` - Build Next.js frontend
  - [ ] `npm run lint` - Run ESLint
  - [ ] `npm run test:e2e` - Run Playwright tests
  - [ ] `npm run start` - Start production server
- [ ] Initialize Firebase Hosting in the repository (if not already done):
  ```bash
  # Option 1: Use the example configuration
  cp firebase.json.example firebase.json
  # Edit firebase.json to match your needs
  
  # Option 2: Initialize with Firebase CLI
  firebase init hosting
  # Select your Firebase project
  # Public directory: .next (for Next.js) or out (for static export)
  # Configure as single-page app: No
  # Set up automatic builds with GitHub: No (we use our custom workflow)
  ```
- [ ] Test the workflow:
  - Push a commit to a feature branch
  - Verify CI workflow runs successfully
  - Create a PR to main and verify preview deploy (if enabled)
  - Merge to main and verify production deploy

## Local Testing

### Test Build Locally

```bash
# Install dependencies
npm ci
cd backend && npm ci && cd ..
cd functions && npm ci && cd ..

# Run lint
npm run lint

# Build frontend
npm run build

# Run tests
npm run test:e2e
```

### Test Firebase Deploy Locally

```bash
# Login to Firebase
firebase login

# Build the project
npm run build

# Deploy to Firebase (requires authentication)
firebase deploy --only hosting
firebase deploy --only functions
```

### Validate Workflow Files

```bash
# Check YAML syntax
cat .github/workflows/ci.yml | yamllint -
cat .github/workflows/firebase-deploy.yml | yamllint -

# Test with act (GitHub Actions local runner)
# Install: https://github.com/nektos/act
act push -W .github/workflows/ci.yml
```

## Troubleshooting

### Build Failures

- **Frontend build fails**: Check for missing dependencies in `package.json`
- **Backend build fails**: Ensure backend has proper build script or is skipped
- **Functions deploy fails**: Verify `FIREBASE_TOKEN` secret and Functions dependencies

### Deployment Issues

- **Permission denied**: Verify service account has `Firebase Hosting Admin` and `Cloud Functions Admin` roles
- **Project not found**: Check `FIREBASE_PROJECT` secret matches your Firebase project ID
- **Preview not created**: Ensure PR is from the same repository (not a fork)

### Secret Management

- Never commit secrets to the repository
- Rotate service account keys periodically (every 90 days recommended)
- Use separate Firebase projects for development and production

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [FirebaseExtended/action-hosting-deploy](https://github.com/FirebaseExtended/action-hosting-deploy)

## Maintenance

- Review and update action versions quarterly
- Monitor workflow runs for failures
- Keep Node.js version in sync with `.nvmrc`
- Update pinned commit SHAs when security patches are available
