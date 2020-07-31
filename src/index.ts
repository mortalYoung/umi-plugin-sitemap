// ref:
// - https://umijs.org/plugins/api
import { IApi, IRoute } from '@umijs/types';
import { Mustache, chalk, lodash } from '@umijs/utils';
import fs from 'fs';
import path from 'path';

/**
 * remove lastet `/` flag
 */
const handlerCharacter = (origin: string) => {
  if (origin.endsWith('/')) {
    const lastIndexof = origin.length - 1;
    return origin.slice(0, lastIndexof);
  }
  return origin;
};

/**
 * assets dynamic route which have `:`
 * @example isDynamicRoute({path: '/xxx/:slug' }) = true
 */
const isDynamicRoute = (route: IRoute) => {
  return route.path?.indexOf(':') !== -1;
};

// transform route to string
const transformToSitemap = (
  suffix: string = '',
  routes: IRoute[],
  dynamicRoute: string[],
) => {
  const origin = handlerCharacter(suffix);
  return routes
    .map(route => handlerCharacter(origin + route.path))
    .concat(dynamicRoute.map(route => handlerCharacter(origin + route)))
    .sort();
};

export default function(api: IApi) {
  api.describe({
    key: 'sitemap',
    config: {
      schema(joi) {
        return joi.array().items(joi.string());
      },
    },
  });

  let routes: IRoute[] = [];
  api.onPatchRoutes(({ routes: routesConfig }) => {
    // only concat destiny route which has destiny component and path, expect dynamic route
    const destinyRoutes = routesConfig.filter(
      route => !!route.component && !!route.path && !isDynamicRoute(route),
    );
    routes = routes.concat(destinyRoutes);
  });

  // generate sitemap.xml after run build
  api.onBuildComplete(({ err }) => {
    try {
      if (!err) {
        const { homepage } = api.pkg;
        const { absOutputPath } = api.paths;
        const { sitemap = [] } = api.userConfig;

        if (!homepage) {
          throw 'Compiled sitemap.xml failed, Please check your homepage';
        }

        const template = fs
          .readFileSync(path.resolve(__dirname, './sitemap.mustache'))
          .toString();

        // remove duplicate route
        const uniqueRoute = lodash.uniqBy(routes, 'path');

        const sitemapArray = transformToSitemap(homepage, uniqueRoute, sitemap);

        const html = Mustache.render(template, { sitemap: sitemapArray });

        fs.writeFileSync(path.resolve(absOutputPath!, 'sitemap.xml'), html);

        console.log(
          chalk.black.bgGreen(' DONE ') +
            chalk.green(' Compiled sitemap.xml successfully'),
        );
      }
    } catch (error) {
      api.logger.error(error);
    }
  });
}
