// AI provider router - picks the right provider based on user preference
import deepseek from './deepseek.js';
import gemini from './gemini.js';
import mistral from './mistral.js';

const providers = { deepseek, gemini, mistral };

export function getProvider(name) {
  return providers[name] || null;
}

// Try preferred provider, fall back to alternatives
export async function chat(accounts, messages, options = {}) {
  const preferred = options.provider || 'deepseek';
  const fallbackOrder = ['deepseek', 'gemini', 'mistral'].filter(p => p !== preferred);
  const tryOrder = [preferred, ...fallbackOrder];

  for (const providerName of tryOrder) {
    const account = accounts.find(a => a.provider === providerName);
    if (!account) continue;

    const provider = providers[providerName];
    if (!provider) continue;

    try {
      return await provider.chat(account.credentials, messages, options);
    } catch (err) {
      console.warn(`AI provider ${providerName} failed: ${err.message}, trying next...`);
    }
  }

  throw new Error('No AI provider available. Connect at least one AI service in Accounts.');
}

export function getAvailableProviders(accounts) {
  return Object.keys(providers).map(name => ({
    name,
    connected: accounts.some(a => a.provider === name),
  }));
}
