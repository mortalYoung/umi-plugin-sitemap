# umi-plugin-sitemap

[![NPM version](https://img.shields.io/npm/v/umi-plugin-sitemap.svg?style=flat)](https://npmjs.org/package/umi-plugin-sitemap)

[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-sitemap.svg?style=flat)](https://npmjs.org/package/umi-plugin-sitemap)

- umi plugin for generating sitemap.xml after building
- for now, only support to umi@3.0.0+

## Install

```bash
# or yarn
$ npm install --save-dev umi-plugin-sitemap
```

## Usage

Configure in `.umirc.js`,

```ts
import { defineConfig } from 'umi';

export default defineConfig({
  ...
  sitemap: ['your-custom-route'],
  ...
});

```

## Options

| 参数    | 说明           | 类型       | 默认值 |
| ------- | -------------- | ---------- | ------ |
| sitemap | 添加自定义路由 | `string[]` | `[]`   |

## LICENSE

MIT
