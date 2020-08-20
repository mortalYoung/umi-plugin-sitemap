const path = require('path');
const fs = require('fs');
const { execSync, spawnSync } = require('child_process');

// 用于生成临时配置文件
const generateTmp = (targetPath: string, content: string) => {
  fs.writeFileSync(targetPath, content);
  return {
    delete: () => {
      fs.unlinkSync(targetPath);
    },
  };
};
const SUCCESS_MESSAGE = 'Compiled sitemap.xml successfully';
const EXAMPLE_DIR = path.resolve(__dirname, '../example');
const SITEMAP_PATH = path.join(EXAMPLE_DIR, './dist/sitemap.xml');
const ENV = 'jest';

// 如果不存在 lib 目录则先执行 build 命令生成
if (!fs.existsSync(path.resolve(__dirname, '../lib'))) {
  const stdout = execSync('npm run build').toString();
  if (stdout.indexof('Transform to cjs for') === -1) {
    throw new Error('test failed');
  }
}

// 如果 example 目录下没有 node_modules 则先执行 install
if (!fs.existsSync(path.join(EXAMPLE_DIR, '/node_modules'))) {
  const stdout = execSync('cd example && yarn').toString();
  if (stdout.indexof('success') === -1) {
    throw new Error('yarn example install failed');
  }
}

describe('generator test', () => {
  // 如果已存在 .umirc.test.ts 则先删除该配置文件
  beforeAll(() => {
    if (fs.existsSync(path.join(EXAMPLE_DIR, `./.umirc.${ENV}.ts`))) {
      fs.unlinkSync(path.join(EXAMPLE_DIR, `./.umirc.${ENV}.ts`));
    }
  });
  // 成功的原因是因为 package.json 配置了 homepage
  it('[success]: test without config parameters', () => {
    const { stdout } = spawnSync('yarn.cmd', ['build'], {
      cwd: EXAMPLE_DIR,
    });
    const resultXML = path.resolve(__dirname, './fixtures/sitemap.xml');
    expect(stdout.toString()).toContain(SUCCESS_MESSAGE);
    expect(fs.readFileSync(SITEMAP_PATH).toString()).toEqual(
      fs.readFileSync(resultXML).toString(),
    );
  });

  it('[success]: test with [sitemap] config parameters', () => {
    const umiCfg = `
      import { defineConfig } from 'umi';
      export default defineConfig({
        nodeModulesTransform: {
          type: 'none',
        },
        routes: [{ path: '/', component: '@/pages/index' }],
        sitemap: {
          homepage: 'https://umijs.org',
          dynamicRoute: ['/foo', '/bar'],
        },
      });`;
    const tmp = generateTmp(
      path.join(EXAMPLE_DIR, `./.umirc.${ENV}.ts`),
      umiCfg,
    );
    const { stdout } = spawnSync('yarn.cmd', ['build'], {
      cwd: EXAMPLE_DIR,
      env: {
        UMI_ENV: ENV,
      },
    });
    const resultXML = path.resolve(__dirname, './fixtures/sitemap-1.xml');
    expect(stdout.toString()).toContain(SUCCESS_MESSAGE);
    expect(fs.readFileSync(SITEMAP_PATH).toString()).toEqual(
      fs.readFileSync(resultXML).toString(),
    );
    tmp.delete();
  });

  it('[success]: test with [sitemap] multiply ducplicate routes', () => {
    const umiCfg = `
      import { defineConfig } from 'umi';
      export default defineConfig({
        nodeModulesTransform: {
          type: 'none',
        },
        routes: [{ path: '/', component: '@/pages/index' }],
        sitemap: {
          homepage: 'https://umijs.org',
          dynamicRoute: ['/foo', '/bar', '/bar' ,'/foo'],
        },
      });`;
    const tmp = generateTmp(
      path.join(EXAMPLE_DIR, `./.umirc.${ENV}.ts`),
      umiCfg,
    );
    const { stdout } = spawnSync('yarn.cmd', ['build'], {
      cwd: EXAMPLE_DIR,
      env: {
        UMI_ENV: ENV,
      },
    });
    const resultXML = path.resolve(__dirname, './fixtures/sitemap-1.xml');
    expect(stdout.toString()).toContain(SUCCESS_MESSAGE);
    expect(fs.readFileSync(SITEMAP_PATH).toString()).toEqual(
      fs.readFileSync(resultXML).toString(),
    );
    tmp.delete();
  });

  it('[success]: test with [sitemap] config but no dynamicRoute', () => {
    const umiCfg = `
      import { defineConfig } from 'umi';
      export default defineConfig({
        nodeModulesTransform: {
          type: 'none',
        },
        routes: [{ path: '/', component: '@/pages/index' }],
        sitemap: {
          homepage: 'https://umijs.org',
        },
      });`;
    const tmp = generateTmp(
      path.join(EXAMPLE_DIR, `./.umirc.${ENV}.ts`),
      umiCfg,
    );
    const resultXML = path.resolve(__dirname, './fixtures/sitemap-2.xml');
    const { stdout } = spawnSync('yarn.cmd', ['build'], {
      cwd: EXAMPLE_DIR,
      env: {
        UMI_ENV: ENV,
      },
    });
    expect(stdout.toString()).toContain(SUCCESS_MESSAGE);
    expect(fs.readFileSync(SITEMAP_PATH).toString()).toEqual(
      fs.readFileSync(resultXML).toString(),
    );
    tmp.delete();
  });

  // 成功的原因是因为 package.json 配置了 homepage
  it('[success]: test with [sitemap] config but no homepage', () => {
    const umiCfg = `
      import { defineConfig } from 'umi';
      export default defineConfig({
        nodeModulesTransform: {
          type: 'none',
        },
        routes: [{ path: '/', component: '@/pages/index' }],
        sitemap: {
          dynamicRoute: ['/foo', '/bar'],
        },
      });`;
    const tmp = generateTmp(
      path.join(EXAMPLE_DIR, `./.umirc.${ENV}.ts`),
      umiCfg,
    );
    const resultXML = path.resolve(__dirname, './fixtures/sitemap-1.xml');
    const { stdout } = spawnSync('yarn.cmd', ['build'], {
      cwd: EXAMPLE_DIR,
      env: {
        UMI_ENV: ENV,
      },
    });
    expect(stdout.toString()).toContain(SUCCESS_MESSAGE);
    expect(fs.readFileSync(SITEMAP_PATH).toString()).toEqual(
      fs.readFileSync(resultXML).toString(),
    );
    tmp.delete();
  });
});
