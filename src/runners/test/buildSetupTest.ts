import * as webpack from 'webpack';
import _pick from 'lodash/pick';
import printBuildError from 'react-dev-utils/printBuildError';
import getResolveConfig from '../../utils/webpackHelpers/getResolveConfig';
import runWebpackCompiler from '../runWebpackCompiler';
import { ModeType, TargetType } from '../../const';
import { SETUP_TEST_FILENAME } from '../../enums';
import { CommandArgs } from '../../interfaces/args.interface';
import paths from '../../paths';
import { SETUP_TEST_PATH } from '../../enums';
import getEnvConfig from '../../utils/getEnvConfig';
import getModuleExtensions from '../../utils/getModuleExtensions';
import getOptimizationConfig from '../../utils/webpackHelpers/getOptimizationConfig';
import getNodeConfig from '../../utils/webpackHelpers/getNodeConfig';
import getScriptLoaders from '../../utils/webpackHelpers/getScriptLoaders';
import { existsSync, emptyDirSync } from '../../utils/fsExtend';

export const buildSetupTest = async (params: CommandArgs): Promise<any> => {
  const {
    platform: platformBuild,
    target: targetBuild,
    setupTest: fileSetupTest,
  } = params;

  if (!fileSetupTest) {
    return true;
  }

  const pathOfSetupTest = paths.resolveInAppPath(fileSetupTest);
  const isFileExists = existsSync(pathOfSetupTest);
  if (!isFileExists) {
    throw new Error(`Not found setup test at "${fileSetupTest}"`);
  }

  const commonConfig = {
    bail: true,
    enableSourceMap: true,
    publicPath: '/',
    mode: ModeType.development,
    platform: platformBuild,
    target: targetBuild as webpack.Configuration['target'],
  };

  const outputConfig: webpack.Output = {
    publicPath: commonConfig.publicPath,
    filename: SETUP_TEST_FILENAME + '.js',
    path: paths.resolveInToolCache(`test-runner/tmp`),
    libraryTarget: 'commonjs2',
    library: SETUP_TEST_FILENAME,
    pathinfo: false,
  };

  const extensions = getModuleExtensions(params.platform);

  const envConfig = getEnvConfig();
  const {
    buildToolWorkerParallelJobs: workerParallelJobs,
    buildToolWorkerPoolTimeout: poolTimeout,
  } = envConfig;

  const scriptModuleConfig = {
    poolTimeout,
    workerParallelJobs,
    target: commonConfig.target as TargetType,
    mode: commonConfig.mode,
    isEnableCache: commonConfig.enableSourceMap,
  };
  const scriptLoaders = getScriptLoaders(
    TargetType.node,
    scriptModuleConfig,
    extensions,
  );

  const webpackConfig: webpack.Configuration = {
    devtool: 'source-map',
    target: commonConfig.target,
    bail: commonConfig.bail,
    mode: commonConfig.mode,
    entry: pathOfSetupTest,
    output: outputConfig,
    resolve: getResolveConfig(TargetType.node, extensions.module),
    module: {
      rules: [...scriptLoaders],
    },
    optimization: getOptimizationConfig(0, commonConfig.enableSourceMap),
    node: getNodeConfig(commonConfig.target),
    externals: [
      (
        context: string,
        request: string,
        callback: (...rest: any[]) => void,
      ) => {
        const isLocalLibrary = /^(@fundoo([\S]+)?)$/.test(request);
        const isUseReactModules = /^(react([\S]+)?)$/.test(request);
        const shouldUseExternalPackages = isLocalLibrary || isUseReactModules;
        if (shouldUseExternalPackages) {
          return callback(null, `commonjs2 ${request}`);
        }

        callback();
      },
    ],
  };

  emptyDirSync(webpackConfig.output.path);

  try {
    await runWebpackCompiler(webpackConfig);
    process.on('exit', () => {
      emptyDirSync(webpackConfig.output.path);
    });
  } catch (ex) {
    printBuildError(ex);
    process.exit(1);
  }

  const setupTestBundle = `${webpackConfig.output.path}/${webpackConfig.output.filename}`;

  process.env[SETUP_TEST_PATH] = setupTestBundle;

  return true;
};

export default buildSetupTest;
