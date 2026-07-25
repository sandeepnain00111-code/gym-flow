"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Startup environment variable validation.
 * Called before the server boots — crashes early with a clear message
 * rather than silently running with insecure fallback secrets.
 */
const validateEnv = () => {
    const required = [
        'JWT_ACCESS_SECRET',
        'JWT_REFRESH_SECRET',
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        console.error(`\n❌  Missing required environment variables:\n  ${missing.join('\n  ')}\n` +
            `Copy .env.example to .env and fill in the values.\n`);
        process.exit(1);
    }
    // Warn about secrets that still match the example file defaults
    const insecureDefaults = {
        JWT_ACCESS_SECRET: 'gymflow_access_secret_key_123456789!',
        JWT_REFRESH_SECRET: 'gymflow_refresh_secret_key_987654321!',
    };
    Object.entries(insecureDefaults).forEach(([key, defaultVal]) => {
        if (process.env[key] === defaultVal) {
            console.warn(`⚠️   ${key} is set to the example default value. ` +
                `Change it to a strong random secret before going to production.`);
        }
    });
};
module.exports = validateEnv;
