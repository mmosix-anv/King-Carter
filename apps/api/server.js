require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const SupabaseDatabase = require('./supabase-database');
const { router: authRoutes } = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const navLinksRoutes = require('./routes/navlinks');
const globalSettingsRoutes = require('./routes/global-settings');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const db = new SupabaseDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/nav-links', navLinksRoutes);
app.use('/api/global-settings', globalSettingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});