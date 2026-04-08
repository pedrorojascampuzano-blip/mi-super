-- NexusAI Database Schema
-- Run this in your Supabase SQL Editor

-- ===========================================
-- Phase 1: Accounts + Auth
-- ===========================================

-- Encrypted credential vault for external services
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,  -- 'slack', 'gmail', 'notion', 'linear', 'whatsapp', 'calendar', 'deepseek', 'gemini', 'mistral'
  label TEXT,               -- User-friendly name like "Work Gmail"
  credentials_encrypted TEXT NOT NULL,
  credentials_iv TEXT NOT NULL,
  credentials_tag TEXT NOT NULL,
  status TEXT DEFAULT 'connected',  -- 'connected', 'disconnected', 'error'
  last_synced_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider, label)
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_accounts" ON accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_accounts_user_service ON accounts(user_id, provider);

-- User preferences (panel layout, theme, etc.)
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'dark',
  panel_layout JSONB DEFAULT '{}',
  default_ai_provider TEXT DEFAULT 'deepseek',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_prefs" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- ===========================================
-- Phase 3-4: Cache + Integrations
-- ===========================================

-- Unified cache for all external service data
CREATE TABLE IF NOT EXISTS cached_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL,        -- 'notion', 'gmail', 'slack', 'linear', 'calendar', 'whatsapp'
  source_id TEXT NOT NULL,     -- Original ID from external service
  item_type TEXT NOT NULL,     -- 'task', 'message', 'contact', 'event', 'project'
  title TEXT,
  body TEXT,
  metadata JSONB DEFAULT '{}',
  source_timestamp TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, source, source_id)
);

ALTER TABLE cached_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_cached_items" ON cached_items
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_cached_type ON cached_items(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_cached_source ON cached_items(user_id, source);

-- Sync log
CREATE TABLE IF NOT EXISTS sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL,
  status TEXT NOT NULL,  -- 'success', 'error', 'partial'
  items_synced INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_sync_log" ON sync_log
  FOR ALL USING (auth.uid() = user_id);

-- ===========================================
-- Phase 5: Contacts + Context
-- ===========================================

-- Contacts (derived from email, Slack, Notion)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  sources JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  last_interaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

-- Context log (maintains work history across sessions)
CREATE TABLE IF NOT EXISTS context_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL,   -- 'task_completed', 'email_sent', 'note_created', etc.
  item_id TEXT,
  summary TEXT NOT NULL,     -- Human-readable: "Replied to John's email about Q2 budget"
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE context_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_context_log" ON context_log
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_context_user_time ON context_log(user_id, created_at DESC);
