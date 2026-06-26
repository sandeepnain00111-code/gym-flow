/**
 * PM2 process management configuration.
 * Usage:
 *   npm install -g pm2
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save && pm2 startup  (auto-restart on reboot)
 */
module.exports = {
  apps: [
    {
      name: 'gymflow-api',
      script: 'src/server.js',

      // Cluster mode — spawns one process per CPU core for maximum throughput
      instances: 'max',
      exec_mode: 'cluster',

      // Auto-restart on crash
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',

      // Log file paths
      out_file:   './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Environment variables per deployment stage
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
