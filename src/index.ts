// ref:
// - https://umijs.org/plugins/api
import { IApi, IRoute } from '@umijs/types';
import { Mustache, chalk, lodash } from '@umijs/utils';
import fs from 'fs';
import path from 'path';

type ISitemapCfg = string[] | { homepage: string; dynamicRoute?: string[] };

/**
 * remove lastet `/` flag
 */
export const handlerCharacter = (origin: string) => {
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
export const isDynamicRoute = (route: IRoute) => {
  return route.path?.indexOf(':') !== -1;
};

// transform route to string
export const transformToSitemap = (
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
        const arrays = joi.array().items(joi.string());
        const objects = joi.object({
          dynamicRoute: joi.array().items(joi.string()),
          homepage: joi.string(),
        });
        return joi.alternatives().try(arrays, objects);
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
        let homepage;
        let dynamicRoutes;
        const { absOutputPath } = api.paths;
        const { sitemap = [] } = <{ sitemap: ISitemapCfg }>api.userConfig;

        if (Array.isArray(sitemap)) {
          homepage = api.pkg.homepage;
          dynamicRoutes = sitemap;
        } else {
          homepage = sitemap.homepage || api.pkg.homepage;
          dynamicRoutes = sitemap.dynamicRoute || [];
        }
        if (!homepage) {
          throw 'Compiled sitemap.xml failed, Please check your homepage';
        }

        const template = fs
          .readFileSync(path.resolve(__dirname, './sitemap.mustache'))
          .toString();

        // remove duplicate route
        const uniqueRoute = lodash.uniqBy(routes, 'path');

        const sitemapArray = transformToSitemap(
          homepage,
          uniqueRoute,
          Array.from(new Set(dynamicRoutes)),
        );

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
