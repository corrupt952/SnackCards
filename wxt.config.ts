import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['readingList'],
    name: 'Snack Cards - Reading List Manager',
    description: 'Manage your Chrome Reading List in a side panel',
    action: {},
  },
});
