# NexusAI

AI-powered productivity hub. Centralizes communications, tasks, and AI tools in one dashboard.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Fill in your Supabase credentials and generate an encryption key:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Set up database
# Run supabase-schema.sql in your Supabase SQL Editor

# 4. Start development
npm run dev
```

Frontend runs on `http://localhost:3002`, API on `http://localhost:3001`.

## Architecture

```
client/          Vanilla JS + Vite frontend
  src/
    lib/         Supabase auth, API client, DOM helpers, event bus
    shell/       Topbar, status bar, command palette (Cmd+K)
    panels/      Tiling panel system (collapse, split, resize)
    views/       Auth, vault/accounts management
    modules/     Feature modules (dashboard, tasks, comms, etc.)

server/          Express.js backend
  src/
    middleware/  Auth (JWT), error handling
    routes/      API endpoints (health, accounts, preferences)
    services/    Supabase client, crypto
    lib/         Encryption (AES-256-GCM)
    integrations/ Service plugins (Notion, Gmail, Slack, etc.)
```

## Key Features

- **Collapsible tiling panels** - split, resize, collapse to thin strips
- **Encrypted credential vault** - AES-256-GCM for all API keys/tokens
- **On-demand sync** - no background loops, data fetched when needed
- **Command palette** - Cmd+K for quick navigation
- **Plugin integrations** - each service is self-contained
