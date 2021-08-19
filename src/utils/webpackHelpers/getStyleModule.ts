import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import flexbugsFixes from 'postcss-flexbugs-fixes';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import checkIsInternalPackage from './checkIsInternalPackage';
import { StyleModuleConfig, UseStyleLoaderConfig } from '../../const';
import classNameGenerator from './classNameGenerator';
import getEnvConfig from '../getEnvConfig';

const useStyleLoaders = (
  config: UseStyleLoaderConfig,
  cssOptions,
  preProcessors?: webpack.Loader[],
): webpack.Loader[] => {
  const { isProduction, isEnableSourceMap } = config;

  const envConfig = getEnvConfig();
  const hasPreProcessors = Array.isArray(preProcessors);
  const customCssOptions = {
    ...cssOptions,
    sourceMap: isEnableSourceMap,
    importLoaders: 1 + (hasPreProcessors ? preProcessors.length : 0),
  };

  const mode = cssOptions.modules.mode;
  if (mode === 'local') {
    const shouldCustomClassName = !envConfig.buildToolCssModuleLocalIdent;
    if (shouldCustomClassName) {
      customCssOptions.getLocalIdent = classNameGenerator;
    } else {
      customCssOptions.localIdentName = envConfig.buildToolCssModuleLocalIdent;
    }
  }
  const loaders = [
    isProduction
      ? MiniCssExtractPlugin.loader
      : { loader: require.resolve('style-loader') },
    {
      loader: require.resolve('css-loader'),
      options: customCssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        sourceMap: isEnableSourceMap,
        plugins: () => [
          flexbugsFixes,
          autoprefixer({
            grid: 'autoplace',
            flexbox: 'no-2009',
          }),
        ],
      },
    },
  ];

  if (hasPreProcessors) {
    loaders.push(...(preProcessors as any[]));
  }

  return loaders.filter(Boolean);
};

const getStyleModule = (config: StyleModuleConfig): webpack.RuleSetRule => {
  const {
    test,
    include,
    exclude,
    target,
    isProduction,
    isEnableSourceMap,
    cssOptions,
    preProcessors,
  } = config;

  return {
    test,
    exclude,
    include: include || checkIsInternalPackage,
    use: useStyleLoaders(
      {
        target,
        isProduction,
        isEnableSourceMap,
      },
      cssOptions,
      preProcessors,
    ),
  };
};

export default getStyleModule;
