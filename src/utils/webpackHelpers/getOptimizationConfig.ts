import * as webpack from 'webpack';
import cssnano from 'cssnano';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import getEnvConfig from '../getEnvConfig';

const getOptimizeCssAssetsPlugin = ({ isEnableSourceMap }): webpack.Plugin =>
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: cssnano,
    cssProcessorOptions: Object.assign(
      {
        zindex: false,
        discardComments: true,
      },
      isEnableSourceMap && {
        map: {
          inline: false,
          annotation: true,
        },
      },
    ),
  });

interface TerserPluginConfig {
  isEnableCache: boolean;
  isEnableDebug: boolean;
  isEnableSourceMap: boolean;
}

const getTerserPlugin = ({
  isEnableSourceMap,
  isEnableCache,
  isEnableDebug,
}: TerserPluginConfig): webpack.Plugin =>
  new TerserPlugin({
    parallel: true,
    sourceMap: isEnableSourceMap,
    cache: isEnableCache,
    terserOptions: {
      parse: {
        ecma: 8,
      },
      compress: {
        comparisons: false,
        inline: 2,
        drop_console: !isEnableDebug,
      },
      mangle: isEnableDebug
        ? false
        : {
            safari10: true,
          },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true,
      },
    },
  });

const commonLibs = [
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'react-router',
  'react-router-config',
  'react-router-dom',
  'seamless-immutable',
];

export default function getOptimizationConfig(
  level: number,
  isEnableSourceMap: boolean,
): webpack.Options.Optimization {
  if (level <= 0) {
    return {
      minimize: false,
    };
  }

  const envConfig = getEnvConfig();
  const {
    buildToolEnableCache: isEnableCache,
    buildToolEnableDebugJs: isEnableDebug,
  } = envConfig;

  return {
    minimize: true,
    usedExports: true,
    minimizer: [
      getTerserPlugin({ isEnableSourceMap, isEnableCache, isEnableDebug }),
      getOptimizeCssAssetsPlugin({ isEnableSourceMap }),
    ].filter(Boolean),
    runtimeChunk: level > 1 ? 'single' : false,
    moduleIds: 'hashed',
    splitChunks:
      level > 1
        ? {
            automaticNameDelimiter: '.',
            name: true,
            chunks: 'all',
            maxSize: 1024 * 1024,

            cacheGroups: {
              common: {
                test: new RegExp(
                  `[\\/]node_modules[\\/](${commonLibs.join('|')})[\\/]`,
                ),
                name: 'c',
                chunks: 'all',
                priority: 99,
              },
              'vendors-async': {
                reuseExistingChunk: true,
                chunks: 'async',
                priority: -10,
              },
              default: {
                priority: -30,
              },
            },
          }
        : {},
  };
}
