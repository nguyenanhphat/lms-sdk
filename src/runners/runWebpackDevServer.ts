import webpack from 'webpack';
import chalk from 'chalk';
import {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} from 'react-dev-utils/WebpackDevServerUtils';
import openBrowser from 'react-dev-utils/openBrowser';
import WebpackDevServer from 'webpack-dev-server';
import paths from '../paths';
import { createDevServerConfig } from './createDevServerConfig';
import { checkPackageJsonField } from '../utils/checkPackageJsonField';
import { BROWSERLIST } from '../enums/packageJson';

function checkoutHost() {
  if (process.env.HOST) {
    console.log(
      chalk.cyan(
        `Attempting to bind to HOST environment variable: ${chalk.yellow(
          chalk.bold(process.env.HOST),
        )}`,
      ),
    );
    console.log(
      `If this was unintentional, check that you haven't mistakenly set it in your shell.`,
    );
    console.log();
  }
}

function getProxyConfig() {
  const proxySetting = require(paths.appPackageJson).proxy;
  return prepareProxy(proxySetting, paths.appPublic, null);
}

export async function runWebpackDevServer(
  webpackConfig: webpack.Configuration,
) {
  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  const isInteractive = process.stdout.isTTY;

  checkoutHost();

  await checkPackageJsonField('browserslist', BROWSERLIST, true, isInteractive);

  const port = await choosePort(HOST, DEFAULT_PORT);
  if (!port) {
    return;
  }

  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const appPackageJson = require(paths.appPackageJson);
  const appName = appPackageJson.name;
  const urls = prepareUrls(protocol, HOST, port);
  const devSocket = {
    warnings: warnings => {
      console.log('warnings', warnings);
    },
    errors: errors => {
      console.log('errors', errors);
    },
  };

  const compiler = createCompiler({
    appName,
    config: webpackConfig,
    devSocket,
    urls,
    useYarn: true,
    useTypeScript: true,
    webpack,
  } as any);

  const proxyConfig = getProxyConfig();
  const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
  const devServer = new WebpackDevServer(compiler, serverConfig);

  devServer.listen(port, HOST, err => {
    if (err) {
      return console.log(err);
    }
    openBrowser(urls.localUrlForBrowser);
  });

  ['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig as any, () => {
      devServer.close();
      process.exit();
    });
  });
}
