# King & Carter Premier - Luxury Transport Website

A modern React + Vite application for King & Carter Premier luxury transport services with an integrated CMS.

## Features

- Modern React frontend with Vite
- Node.js/Express backend API
- Supabase database integration
- Admin CMS for content management
- Responsive design
- Service management system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.template .env
   ```
   Fill in your Supabase credentials in `.env`

4. Run the database migration:
   ```bash
   cd apps/api
   node migrate.js --seed-services
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

## Admin Access

The CMS admin panel is available at `/admin`

### Default Login Credentials

**Username:** `admin`  
**Password:** `admin123`

> ⚠️ **Important:** Change these default credentials in production!

### Admin Features

- Service content management
- Image upload and management
- Navigation configuration
- Global settings

## Development

### Project Structure

```
kc-web/
├── apps/
│   ├── api/          # Backend API
│   └── web/          # Frontend React app
├── .env              # Environment variables
└── README.md
```

### Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

## Database

See [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md) for database setup and migration details.
