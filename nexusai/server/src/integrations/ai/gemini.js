// Gemini AI provider - direct fetch, no SDK
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export default {
  name: 'gemini',
  requiredCredentials: ['api_key'],

  async validate(credentials) {
    try {
      const res = await fetch(
        `${BASE_URL}/gemini-2.5-flash:generateContent?key=${credentials.api_key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'hi' }] }],
            generationConfig: { maxOutputTokens: 5 },
          }),
        }
      );
      return res.ok;
    } catch {
      return false;
    }
  },

  async chat(credentials, messages, options = {}) {
    // Convert OpenAI-style messages to Gemini format
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const model = options.model || 'gemini-2.5-flash';
    const res = await fetch(
      `${BASE_URL}/${model}:generateContent?key=${credentials.api_key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: options.maxTokens || 2048,
            temperature: options.temperature ?? 0.7,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini error: ${err}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },
};
