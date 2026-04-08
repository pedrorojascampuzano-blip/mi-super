import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3001,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  encryptionKey: process.env.ENCRYPTION_KEY,
};

// Validate required vars
const required = ['supabaseUrl', 'supabaseServiceKey', 'encryptionKey'];
for (const key of required) {
  if (!config[key]) {
    console.warn(`Warning: Missing ${key} in environment. Some features may not work.`);
  }
}
