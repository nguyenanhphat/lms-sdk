import glob from 'glob';
import chalk from 'chalk';
import paths from '../paths';
import getBabelConfig from '../runners/test/getBabelConfig';
import babelCompiler from './babelCompiler';
import memoizeFn from './memoizeFn';
import { AppConfigFactory, AppConfig } from '../const';

const defaultParams = {
  paths,
};

const emptyFn = () => ({});

export const getAppConfig = memoizeFn(
  (): AppConfigFactory => {
    const regexOfConfigPath = paths.resolveInAppPath(`app.config.+(js|ts)`);
    const matchedConfigPaths = glob.sync(regexOfConfigPath);
    const matchedConfigPath = matchedConfigPaths && matchedConfigPaths[0];
    if (!matchedConfigPath) {
      return emptyFn as AppConfigFactory;
    }

    const babelConfig = getBabelConfig({ includeTypescript: true });
    const moduleTransformed = babelCompiler(
      matchedConfigPath,
      babelConfig,
      false,
    );

    try {
      // tslint:disable-next-line:no-eval
      const configFactory = eval(moduleTransformed.code);
      const wrappedConfigFactory = (params?: any): AppConfig =>
        configFactory({ ...defaultParams, ...params });
      return wrappedConfigFactory;
    } catch (error) {
      console.error(
        chalk.red(
          `Invalid config in ${chalk.bold(
            'App config',
          )}, please check detail error below!`,
        ),
      );
      console.error(chalk.red(error));
      process.exit(1);
    }
  },
);
