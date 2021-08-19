import checkIsInternalPackage from './checkIsInternalPackage';
import babelConfigFactory from '../babelConfigFactory';
import { TargetType, BabelModuleConfig } from '../../const';
import webpack from 'webpack';

const getBabelModule = (
  moduleConfig: BabelModuleConfig,
): webpack.RuleSetRule => {
  const {
    test,
    target,
    mode,
    workerParallelJobs,
    poolTimeout,
    isEnableCache,
    includeTypescript,
  } = moduleConfig;

  const babelConfig = babelConfigFactory(
    { target, mode },
    { includeTypescript },
  );

  return {
    test,
    include: checkIsInternalPackage,
    use: [
      {
        loader: require.resolve('thread-loader'),
        options: {
          workerParallelJobs,
          poolTimeout,
          workerNodeArgs: ['--max-old-space-size=1024'],
          poolParallelJobs: 50,
          name: 'babel-loader-pool',
        },
      },
      {
        loader: require.resolve('babel-loader'),
        options: {
          ...babelConfig,
          cacheDirectory: isEnableCache,
        },
      },
    ],
  };
};

export default getBabelModule;
