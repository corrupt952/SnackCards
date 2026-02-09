import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['readingList'],
    name: 'Snack Cards - Reading List Manager',
    description: 'Beautiful card view for your Chrome Reading List in a side panel. Articles and videos, simple and clean.',
    action: {},
  },
});
