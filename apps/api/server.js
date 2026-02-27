require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const SupabaseDatabase = require('./supabase-database');
const { router: authRoutes } = require('./routes/auth');
const { router: servicesRoutes } = require('./routes/services');
const navLinksRoutes = require('./routes/navlinks');
const globalSettingsRoutes = require('./routes/global-settings');
const { router: mediaRoutes } = require('./routes/media');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const db = new SupabaseDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files as static assets
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/nav-links', navLinksRoutes);
app.use('/api/global-settings', globalSettingsRoutes);
app.use('/api/media', mediaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for non-existent routes (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});