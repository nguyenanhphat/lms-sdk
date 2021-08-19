import * as webpack from 'webpack';
import { FactoryConfig, ModeType, TargetType } from '../const';
import dotenvTransform from '../utils/dotenvTransform';
import getCommitHash from '../utils/getCommitHash';
import getEnvConfig from '../utils/getEnvConfig';
import getModuleExtensions from '../utils/getModuleExtensions';
import appendBundleAnalyzerPlugin from './webpackHelpers/appendBundleAnalyzerPlugin';
import getModuleConfig from './webpackHelpers/getModuleConfig';
import getNodeConfig from './webpackHelpers/getNodeConfig';
import getOptimizationConfig from './webpackHelpers/getOptimizationConfig';
import getOutputConfig from './webpackHelpers/getOutputConfig';
import getPerformanceConfig from './webpackHelpers/getPerformanceConfig';
import getPluginsConfig from './webpackHelpers/getPluginsConfig';
import getResolveConfig from './webpackHelpers/getResolveConfig';
import getTargetConfig from './webpackHelpers/getTargetConfig';
import wrapSpeedMeasurePlugin from './webpackHelpers/wrapSpeedMeasurePlugin';

export function webpackConfigFactory(
  factoryConfig: FactoryConfig,
): webpack.Configuration {
  const env = dotenvTransform();
  const envConfig = getEnvConfig();

  const {
    buildToolEnableSourceMap: isEnableSourceMap,
    buildToolEnableBundleAnalyzer: isEnableBundleAnalyzer,
  } = envConfig;

  const commitHash = getCommitHash();

  const isBuildForSW = factoryConfig.target === TargetType.sw;
  const isBuildForWeb = factoryConfig.target === TargetType.web;
  const isBuildForNode = factoryConfig.target === TargetType.node;

  const isProdMode = factoryConfig.mode === ModeType.production;

  const isBuildSWProdMode = isBuildForSW && isProdMode;
  const isBuildWebProdMode = isBuildForWeb && isProdMode;
  const isBuildNodeProdMode = isBuildForNode && isProdMode;

  const extensions = getModuleExtensions(factoryConfig.platform);

  const outputConfig = getOutputConfig(factoryConfig);
  const resolveConfig = getResolveConfig(
    factoryConfig.target,
    extensions.module,
  );
  const moduleConfig = getModuleConfig(factoryConfig, isEnableSourceMap);
  const optimizationConfig = getOptimizationConfig(
    isBuildWebProdMode ? 2 : isBuildSWProdMode || isBuildNodeProdMode ? 1 : 0,
    isEnableSourceMap,
  );
  const nodeConfig = getNodeConfig(
    factoryConfig.target as webpack.Configuration['target'],
  );
  const performanceConfig = getPerformanceConfig(!isBuildWebProdMode);
  const pluginsConfig = getPluginsConfig(factoryConfig, env);

  const externalsConfig = [];

  const isHaveExternalModules = !!(
    factoryConfig.externalModules && factoryConfig.externalGlobalVariable
  );
  if (isHaveExternalModules) {
    const externalGlobalVariable = factoryConfig.externalGlobalVariable;
    const checkIncludedExternalModules = (request: string) =>
      factoryConfig.externalModules.length === 0
        ? false
        : new RegExp(`(${factoryConfig.externalModules.join('|')})$`, 'i').test(
            request,
          );

    const pickExternalsModule = (
      context: string,
      request: string,
      callback,
    ) => {
      const isCalledInCommon = /(@fundoo\/common\/src)/.test(context);
      if (!isCalledInCommon) {
        const isIncludedExternalModules = checkIncludedExternalModules(request);
        if (isIncludedExternalModules) {
          return callback(null, `root ${externalGlobalVariable}['${request}']`);
        }
      }

      callback();
    };
    externalsConfig.push(pickExternalsModule);
  }

  const target = getTargetConfig(factoryConfig.target);

  const configuration: webpack.Configuration = {
    target,
    bail: factoryConfig.bail,
    mode: factoryConfig.mode,
    entry: factoryConfig.entry,
    devtool: isEnableSourceMap ? 'source-map' : false,
    output: outputConfig,
    resolve: resolveConfig,
    module: moduleConfig,
    optimization: optimizationConfig,
    node: nodeConfig,
    performance: performanceConfig,
    plugins: pluginsConfig,
    externals: externalsConfig,
  };

  const shouldAppendBundleAnalyzer =
    isBuildWebProdMode && isEnableBundleAnalyzer;
  if (shouldAppendBundleAnalyzer) {
    appendBundleAnalyzerPlugin(configuration, commitHash);
  }

  if (isProdMode) {
    return wrapSpeedMeasurePlugin(configuration);
  }

  return configuration;
}
