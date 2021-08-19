import * as webpack from 'webpack';
import { FactoryConfig } from '../../const';
import getEnvConfig from '../getEnvConfig';
import getModuleExtensions from '../getModuleExtensions';
import { getBuildCacheDir } from '../getCacheDirectory';
import checkIsInternalPackage from './checkIsInternalPackage';
import getScriptLoaders from './getScriptLoaders';
import getStyleLoaders from './getStyleLoaders';

/**
 * Get modules for webpack config
 */
export const getModuleConfig = (
  factoryConfig: FactoryConfig,
  sourceMap: boolean,
): webpack.Configuration['module'] => {
  const envConfig = getEnvConfig();
  const {
    buildToolEnableCache: isEnableCache,
    buildToolWorkerParallelJobs: workerParallelJobs,
    buildToolWorkerPoolTimeout: poolTimeout,
  } = envConfig;

  const extensions = getModuleExtensions(factoryConfig.platform);

  const cacheLoaderConfig = isEnableCache && {
    loader: require.resolve('cache-loader'),
    options: {
      cacheDirectory: getBuildCacheDir('loader'),
    },
  };
  const useCacheLoader = (loaders: webpack.Loader[]): webpack.Loader[] =>
    [cacheLoaderConfig, ...loaders].filter(Boolean);

  const scriptModuleConfig = {
    target: factoryConfig.target,
    mode: factoryConfig.mode,
    workerParallelJobs,
    poolTimeout,
    isEnableCache,
  };
  const scriptLoaders = getScriptLoaders(
    factoryConfig.target,
    scriptModuleConfig,
    extensions,
  );

  const styleModuleConfig = {
    target: factoryConfig.target,
    mode: factoryConfig.mode,
    isEnableSourceMap: sourceMap,
  };
  const styleLoaders = getStyleLoaders(styleModuleConfig);

  return {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          ...scriptLoaders,
          ...styleLoaders,
          {
            test: /\.icon\.svg$/,
            include: checkIsInternalPackage,
            use: useCacheLoader([
              {
                loader: require.resolve('@svgr/webpack'),
                options: {
                  icon: true,
                },
              },
            ]),
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            include: checkIsInternalPackage,
            use: useCacheLoader([
              {
                loader: require.resolve('url-loader'),
                options: {
                  limit: 5120,
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ]),
          },
          {
            test: [/\.base64\.svg$/],
            include: checkIsInternalPackage,
            use: useCacheLoader([
              {
                loader: require.resolve('url-loader'),
                options: {
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ]),
          },
          {
            test: [/\.svg$/],
            include: checkIsInternalPackage,
            use: useCacheLoader([
              {
                loader: require.resolve('url-loader'),
                options: {
                  limit: 5120,
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ]),
          },
          {
            test: [/\.mock\.json$/],
            include: checkIsInternalPackage,
            type: 'javascript/auto',
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/mock/[name].[hash:8].[ext]',
            },
          },
          {
            test: [/\.txt$/, /\.md$/],
            include: checkIsInternalPackage,
            use: require.resolve('raw-loader'),
          },
          {
            test: /\.template$/,
            include: checkIsInternalPackage,
            loader: 'handlebars-loader',
          },
          {
            exclude: [/\.(ts|tsx|js|jsx)$/, /\.html$/, /\.json$/],
            use: [
              {
                loader: require.resolve('file-loader'),
                options: {
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ],
          },
        ],
      },
    ],
  };
};

export default getModuleConfig;
