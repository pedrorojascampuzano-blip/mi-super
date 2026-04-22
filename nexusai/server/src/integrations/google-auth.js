// Shared Google OAuth2 helper - exchanges refresh_token for access_token
// Caches tokens in-memory until expiry

const tokenCache = new Map();

function cacheKey(credentials) {
  return `${credentials.client_id}:${credentials.refresh_token}`;
}

export async function getGoogleAccessToken(credentials) {
  const key = cacheKey(credentials);
  const cached = tokenCache.get(key);

  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: credentials.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google OAuth refresh failed: ${err}`);
  }

  const data = await res.json();
  tokenCache.set(key, {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  });

  return data.access_token;
}

export async function googleFetch(accessToken, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google API error ${res.status}: ${err.slice(0, 200)}`);
  }
  return res.json();
}
