// PM2 process config
// Usage: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name:             'booking-proxy',
      script:           'server.js',
      instances:        1,          // increase to 'max' for multi-core
      exec_mode:        'fork',     // use 'cluster' if instances > 1
      watch:            false,      // let PM2 manage restarts, not file watching
      max_memory_restart: '256M',

      env: {
        NODE_ENV:       'production',
        PORT:           3001,
        LIMO_ALIAS:     'kingandcarter',
        CACHE_TTL:      300,
        TRUST_PROXY:    true,
        REFRESH_SECRET: 'CHANGE_ME',
      },

      // Logging
      out_file:  './logs/out.log',
      error_file:'./logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',

      // Auto-restart on crash
      autorestart:  true,
      restart_delay: 3000,
    },
  ],
};
