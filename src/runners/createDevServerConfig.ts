import express from 'express';
import ignoredFiles from 'react-dev-utils/ignoredFiles';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import * as WebpackDevServer from 'webpack-dev-server';

import paths from '../paths';
import { existsSync } from '../utils/fsExtend';
import { hasOwn } from '../utils/native';

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

export function createDevServerConfig(
  proxy,
  allowedHost,
): WebpackDevServer.Configuration {
  return {
    disableHostCheck:
      !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    watchContentBase: true,
    hot: true,
    publicPath: '/',
    quiet: true,
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    https: protocol === 'https',
    host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    public: allowedHost,
    proxy,
    before(app, server) {
      const shouldEnableProxy = existsSync(paths.proxySetup);
      if (shouldEnableProxy) {
        const proxyMap = require(paths.proxySetup)();
        const proxyMiddleware = require('http-proxy-middleware');

        for (const route in proxyMap) {
          if (hasOwn(proxyMap, route)) {
            app.use(route, proxyMiddleware(proxyMap[route]));
          }
        }
      }

      const shouldExposeSw = existsSync(paths.serviceworkerFolder);
      if (shouldExposeSw) {
        app.use(express.static('build/service-worker'));
      }

      app.use(evalSourceMapMiddleware(server));
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware(''));
    },
  };
}
