# Vercel Deployment Guide

## Overview

This project is a Vite + React SPA that deploys directly to Vercel without needing an Express server. Vercel handles the static file serving and routing automatically.

## Configuration

### vercel.json
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- **buildCommand**: Runs `pnpm build` which executes `vite build`
- **outputDirectory**: Points to `dist/public` where Vite outputs the built files
- **rewrites**: All routes redirect to `index.html` for client-side routing (Wouter)

### Build Output

Vite builds to `dist/public/` with this structure:
```
dist/public/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── other static files
```

## Deployment Steps

### First Time Setup

1. Install Vercel CLI (optional):
   ```bash
   pnpm add -g vercel
   ```

2. Link your project to Vercel:
   ```bash
   vercel link
   ```

3. Set environment variables in Vercel dashboard:
   - `VITE_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key

### Deploy

#### Option 1: Git Integration (Recommended)
1. Push to your Git repository (GitHub, GitLab, Bitbucket)
2. Vercel automatically builds and deploys

#### Option 2: Manual Deploy
```bash
vercel --prod
```

## Environment Variables

Add these in Vercel Dashboard > Settings > Environment Variables:

```
VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**Important**: 
- Variable names must match exactly what's in your code
- `SUPABASE_ANON_KEY` is exposed via `envPrefix` in vite.config.ts
- After adding/changing variables, you must redeploy

## Local Development vs Production

### Local Development
- Uses `pnpm dev` which runs Vite dev server
- Hot module replacement (HMR)
- Runs on `http://localhost:3000`

### Production (Vercel)
- Uses `pnpm build` which creates optimized static files
- Vercel serves static files from `dist/public/`
- Vercel handles routing via rewrites
- No Express server needed

## Why No Express Server?

The `server/index.ts` file is only needed if you're deploying to a traditional Node.js hosting platform. Vercel is optimized for static sites and serverless functions, so:

1. **Static files**: Vercel's CDN serves your built files directly
2. **Routing**: Vercel's rewrites handle client-side routing
3. **Performance**: CDN edge caching is faster than Express
4. **Scalability**: Automatic scaling without server management

## Troubleshooting

### Blank page after deployment

**Cause**: Build output directory mismatch

**Solution**: Verify `vercel.json` has:
```json
"outputDirectory": "dist/public"
```

### 404 on page refresh

**Cause**: Missing rewrite rules

**Solution**: Verify `vercel.json` has:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### Environment variables not working

**Cause**: Missing `VITE_` prefix or not set in Vercel

**Solution**: 
1. All client-side env vars must start with `VITE_`
2. Set them in Vercel Dashboard > Settings > Environment Variables
3. Redeploy after adding variables

### Build fails

**Cause**: Missing dependencies or build errors

**Solution**:
1. Check build logs in Vercel dashboard
2. Test build locally: `pnpm build`
3. Ensure all dependencies are in `package.json`

## Build Scripts

- `pnpm dev`: Start Vite dev server (local development)
- `pnpm build`: Build for production (Vercel uses this)
- `pnpm build:server`: Build with Express server (for non-Vercel deployments)
- `pnpm preview`: Preview production build locally
- `pnpm start`: Run Express server (for non-Vercel deployments)

## Alternative Deployment (with Express)

If you need to deploy to a platform that requires a Node.js server (Railway, Render, etc.):

1. Use `build:server` script:
   ```json
   "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
   ```

2. Start with:
   ```bash
   node dist/index.js
   ```

3. The Express server will serve files from `dist/public/`

## Vercel Project Settings

Recommended settings in Vercel dashboard:

- **Framework Preset**: Vite
- **Build Command**: `pnpm build`
- **Output Directory**: `dist/public`
- **Install Command**: `pnpm install`
- **Node Version**: 18.x or higher

## Performance Optimization

Vercel automatically provides:
- Global CDN distribution
- Automatic HTTPS
- Brotli/Gzip compression
- HTTP/2 support
- Edge caching
- DDoS protection

## Monitoring

- View deployment logs in Vercel dashboard
- Check Analytics for traffic and performance
- Monitor Speed Insights (already integrated in app)
- Use Vercel Analytics (already integrated in app)

## Custom Domain

1. Go to Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificate

## Summary

Your app is now configured for optimal Vercel deployment:
- ✅ Static build output to `dist/public`
- ✅ Client-side routing via rewrites
- ✅ No server needed
- ✅ Environment variables configured
- ✅ Analytics and Speed Insights integrated
- ✅ Ready for production deployment
