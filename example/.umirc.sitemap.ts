import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  sitemap: {
    homepage: 'https://umijs.org',
    dynamicRoute: ['/foo', '/hello'],
  },
  plugins: ['../lib/index.js'],
});
