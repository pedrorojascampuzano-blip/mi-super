import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Load .env from the repository root (server/src/config.js -> ../../ is repo root)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Accept either SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY
export const config = {
  port: process.env.PORT || 3001,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  encryptionKey: process.env.ENCRYPTION_KEY,

  // Bootstrap: auto-seed credentials from env into the accounts table
  // when the user with this email signs in (set BOOTSTRAP_USER_EMAIL to enable)
  bootstrapUserEmail: process.env.BOOTSTRAP_USER_EMAIL || null,
  bootstrapCredentials: {
    gmail: (process.env.GMAIL_REFRESH_TOKEN && process.env.GMAIL_CLIENT_ID)
      ? {
          refresh_token: process.env.GMAIL_REFRESH_TOKEN,
          client_id: process.env.GMAIL_CLIENT_ID,
          client_secret: process.env.GMAIL_CLIENT_SECRET,
        }
      : null,
    calendar: (process.env.CALENDAR_REFRESH_TOKEN && process.env.CALENDAR_CLIENT_ID)
      ? {
          refresh_token: process.env.CALENDAR_REFRESH_TOKEN,
          client_id: process.env.CALENDAR_CLIENT_ID,
          client_secret: process.env.CALENDAR_CLIENT_SECRET,
        }
      : null,
    slack: process.env.SLACK_BOT_TOKEN
      ? { bot_token: process.env.SLACK_BOT_TOKEN }
      : null,
    notion: process.env.NOTION_API_KEY
      ? {
          api_key: process.env.NOTION_API_KEY,
          databases: {
            tasks: process.env.NOTION_DB_TASKS || null,
            projects: process.env.NOTION_DB_PROJECTS || null,
            contacts: process.env.NOTION_DB_CONTACTS || null,
            organizations: process.env.NOTION_DB_ORGANIZATIONS || null,
            resources: process.env.NOTION_DB_RESOURCES || null,
          },
        }
      : null,
    linear: process.env.LINEAR_API_KEY
      ? { api_key: process.env.LINEAR_API_KEY }
      : null,
    deepseek: process.env.DEEPSEEK_API_KEY
      ? { api_key: process.env.DEEPSEEK_API_KEY }
      : null,
    gemini: process.env.GEMINI_API_KEY
      ? { api_key: process.env.GEMINI_API_KEY }
      : null,
    mistral: process.env.MISTRAL_API_KEY
      ? { api_key: process.env.MISTRAL_API_KEY }
      : null,
  },
};

// Validate required vars
const required = ['supabaseUrl', 'supabaseServiceKey', 'encryptionKey'];
for (const key of required) {
  if (!config[key]) {
    console.warn(`Warning: Missing ${key} in environment. Some features may not work.`);
  }
}
