// Base integration interface
// Every integration plugin must export an object with this shape:
//
// export default {
//   name: 'notion',
//   requiredCredentials: ['api_key'],
//   async validate(credentials) { return true/false },
//   async sync(credentials, lastSyncAt) { return { items: [...], errors: [] } },
//   actions: {
//     search: async (credentials, query) => { ... },
//   }
// }

export function validatePlugin(plugin) {
  const required = ['name', 'requiredCredentials', 'validate', 'sync'];
  for (const key of required) {
    if (!plugin[key]) throw new Error(`Integration plugin missing '${key}'`);
  }
  return plugin;
}
