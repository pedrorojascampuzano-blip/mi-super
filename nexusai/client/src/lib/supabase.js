// Supabase client - lazy loaded from CDN (no npm dependency needed for client)
let supabase = null;

async function getClient() {
  if (supabase) return supabase;

  // Load Supabase from CDN
  if (!window.supabase) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    return null;
  }

  supabase = window.supabase.createClient(url, key);
  return supabase;
}

export async function signUp(email, password) {
  const client = await getClient();
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const client = await getClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = await getClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const client = await getClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data?.session;
}

export async function getUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function onAuthChange(callback) {
  const client = await getClient();
  if (!client) return () => {};
  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
  return () => data.subscription.unsubscribe();
}
