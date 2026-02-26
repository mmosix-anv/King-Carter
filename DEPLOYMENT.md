# Vercel Deployment Setup

## Structure
- `apps/web` - React frontend with admin panel (routes: `/admin/*`)
- `apps/api` - Express.js API server (routes: `/api/*`)

## For Existing Git Deployment

### Update Vercel Project Settings:
1. Go to Vercel Dashboard → Your Project → Settings
2. **Build & Development Settings:**
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `apps/web/dist`
   - Install Command: `npm install`
   - ✅ **Enable:** "Include files outside the root directory in the Build Step"

3. **Root Directory:** Leave empty (uses monorepo root)

4. **Environment Variables:** Add your existing vars

### Git Auto-Deploy
Push to your connected branch - Vercel will:
- Build both apps using `turbo.json`
- Route `/api/*` to Express server
- Route everything else to React app

## Manual Deploy (Alternative)
```bash
vercel --prod
```

## Routes
- `/` - Main website
- `/admin/login` - Admin login  
- `/admin/services` - Admin panel
- `/api/*` - API endpoints

## Local Development
```bash
npm run dev  # Starts both web and API
```