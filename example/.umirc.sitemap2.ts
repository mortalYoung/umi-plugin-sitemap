import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  sitemap: {
    homepage: 'https://umijs.org',
  },
  plugins: ['../lib/index.js'],
});
