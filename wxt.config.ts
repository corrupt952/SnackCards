import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['readingList'],
    name: 'Snack Cards',
    description: 'Display your Chrome Reading List as beautiful cards in a new tab',
    action: {},
  },
});
