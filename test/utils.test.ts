import {
  handlerCharacter,
  isDynamicRoute,
  transformToSitemap,
} from '../src/index';

test('handlerCharacter', () => {
  // remove lasted '/'
  expect(handlerCharacter('https://umijs.org/')).toEqual('https://umijs.org');

  // do nothing
  expect(handlerCharacter('https://umijs.org')).toEqual('https://umijs.org');
});

test('isDynamicRoute', () => {
  // isnot dynamic route
  expect(isDynamicRoute({ path: '/' })).toBeFalsy;

  // isnot dynamic route
  expect(isDynamicRoute({ path: '/test' })).toBeFalsy;

  // is dynamic route
  expect(isDynamicRoute({ path: '/test/:slug' })).toBeTruthy;
});

test('transformToSitemap', () => {
  // extract path out to string Array
  expect(transformToSitemap('', [{ path: '/test' }], [])).toEqual(['/test']);

  // remove lasted '/' when extracting path
  expect(
    transformToSitemap('', [{ path: '/test' }, { path: '/demo/' }], []),
  ).toEqual(['/demo', '/test']);

  // add suffix to each path
  expect(
    transformToSitemap(
      'https://umijs.org/',
      [{ path: '/test' }, { path: '/demo/' }],
      [],
    ),
  ).toEqual(['https://umijs.org/demo', 'https://umijs.org/test']);

  // add custom dynamic route to path
  expect(
    transformToSitemap(
      'https://umijs.org/',
      [{ path: '/test' }, { path: '/demo/' }],
      ['/plugins/test'],
    ),
  ).toEqual([
    'https://umijs.org/demo',
    'https://umijs.org/plugins/test',
    'https://umijs.org/test',
  ]);
});
