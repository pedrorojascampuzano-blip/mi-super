// DeepSeek AI provider - direct fetch, no SDK
const BASE_URL = 'https://api.deepseek.com/chat/completions';

export default {
  name: 'deepseek',
  requiredCredentials: ['api_key'],

  async validate(credentials) {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${credentials.api_key}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 5,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async chat(credentials, messages, options = {}) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.api_key}`,
      },
      body: JSON.stringify({
        model: options.model || 'deepseek-chat',
        messages,
        max_tokens: options.maxTokens || 2048,
        temperature: options.temperature ?? 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek error: ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  },
};
