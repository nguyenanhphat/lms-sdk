import * as webpack from 'webpack';
import sass from 'node-sass';
import Fibers from 'fibers';
import { StyleLoaderConfig, ModeType, TargetType } from '../../const';
import getStyleModule from './getStyleModule';
import getAppModulesResolve from '../getAppModulesResolve';

const cssGlobalRegex = /(\.global\.css$|monaco)/;
const cssModuleRegex = /\.css$/;
const sassGlobalRegex = /\.global\.(scss|sass)$/;
const sassModuleRegex = /\.(scss|sass)$/;

const getSassLoaderOptions = ({ isEnableSourceMap }): webpack.Loader => {
  const appModulesResolve = getAppModulesResolve();

  return {
    loader: require.resolve('sass-loader'),
    options: {
      sourceMap: isEnableSourceMap,
      includePaths: appModulesResolve,
      fiber: Fibers,
      implementation: sass,
    },
  };
};

export default function getStyleLoders(
  styleLoaderConfig: StyleLoaderConfig,
): webpack.RuleSetRule[] {
  const { target, mode, isEnableSourceMap } = styleLoaderConfig;

  const isExportOnlyLocals = target === TargetType.node;
  const isProduction = mode === ModeType.production;

  const moduleConfig = {
    target,
    isProduction,
    isEnableSourceMap,
  };

  const defaultCssOptions = {
    onlyLocals: isExportOnlyLocals,
  };

  const moduleLoaderForCssGlobal = getStyleModule({
    ...moduleConfig,
    test: cssGlobalRegex,
    cssOptions: {
      ...defaultCssOptions,
      modules: false,
    },
  });

  const moduleLoaderForCssModule = getStyleModule({
    ...moduleConfig,
    test: cssModuleRegex,
    exclude: cssGlobalRegex,
    cssOptions: {
      ...defaultCssOptions,
      modules: {
        mode: 'local',
      },
    },
  });

  const sassLoaderOptions = getSassLoaderOptions({
    isEnableSourceMap,
  });

  const moduleLoaderForSassGlobal = getStyleModule({
    ...moduleConfig,
    test: cssModuleRegex,
    cssOptions: {
      ...defaultCssOptions,
      modules: false,
    },
    preProcessors: [sassLoaderOptions],
  });

  const moduleLoaderForSassModule = getStyleModule({
    ...moduleConfig,
    test: sassModuleRegex,
    exclude: sassGlobalRegex,
    cssOptions: {
      ...defaultCssOptions,
      modules: {
        mode: 'local',
      },
    },
    preProcessors: [sassLoaderOptions],
  });

  return [
    moduleLoaderForCssGlobal,
    moduleLoaderForCssModule,
    moduleLoaderForSassGlobal,
    moduleLoaderForSassModule,
  ];
}
