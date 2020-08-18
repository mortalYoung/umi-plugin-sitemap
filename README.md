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

In this way, you should set your homepage in `package.json`

```ts
// .umirc.ts
import { defineConfig } from 'umi';

export default defineConfig({
  ...
  sitemap: ['your-custom-route'],
  ...
});

// package.json
{
  ...
  "homepage": "your-homepage",
  ...
}

```

or Configure like that

```ts
import { defineConfig } from 'umi';

export default defineConfig({
  ...
  sitemap: {
    homepage: 'your-homepage',
    dynamicRoute: ['your-custom-route']
  },
  ...
});
```

## FAQ

If you set homepage **both** in config and package, `umi-plugin-sitemap` will use config one.

## Options

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| sitemap | 添加自定义路由和 `homepage` | `string[] | { homepage: string; dynamicRoute?: string[] }` | `[]` |

## LICENSE

MIT
