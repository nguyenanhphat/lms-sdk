import * as webpack from 'webpack';
import path from 'path';
import { TargetType, FactoryConfig, ModeType } from '../../const';
import { ensureSlash } from '../ensureSlash';
import getPackageJson from '../getPackageJson';
import paths from '../../paths';
import {
  getJsonpFunctionName,
  getLibraryTarget,
  getGlobalObject,
} from './outputConfigHelpers';

const mapOfOutputConfigBasedOnTarget = {
  [TargetType.node]: () => ({
    outDir: paths.serverBuildFolder,
    filename: 'server.js',
    chunkFilename: 'server.js',
  }),

  [TargetType.sw]: () => ({
    outDir: paths.serviceworkerFolder,
    filename: 'service-worker.js',
    chunkFilename: 'service-worker.js',
  }),

  [TargetType.web]: (mode: FactoryConfig['mode']) => {
    const outDir = paths.clientBuildFolder;

    let filename: string;
    let chunkFilename: string;
    if (mode === ModeType.development) {
      filename = 'static/js/[name]-[hash].js';
      chunkFilename = 'static/js/[name]-[hash].js';
    } else {
      filename = 'static/js/[name]-[contenthash].js';
      chunkFilename = 'static/js/[name]-[contenthash].js';
    }

    return {
      outDir,
      filename,
      chunkFilename,
    };
  },
};

export default function getOutputConfig(
  factoryConfig: FactoryConfig,
): webpack.Configuration['output'] {
  const pkgJson = getPackageJson();

  const jsonpFunction = getJsonpFunctionName(
    pkgJson.name,
    factoryConfig.target,
  );
  const libraryTarget = getLibraryTarget(factoryConfig.target);
  const globalObject = getGlobalObject(factoryConfig.target);

  const outputFactory = mapOfOutputConfigBasedOnTarget[factoryConfig.target];
  if (typeof outputFactory !== 'function') {
    throw new Error(`${factoryConfig.target} is invalid target!`);
  }

  const { outDir, filename, chunkFilename } = outputFactory(factoryConfig.mode);

  return {
    filename,
    chunkFilename,
    jsonpFunction,
    libraryTarget,
    globalObject,
    pathinfo: false,
    path: outDir,
    publicPath: ensureSlash(process.env.PUBLIC_URL || '/', true),
    devtoolModuleFilenameTemplate: (info): string =>
      path.relative(paths.appSrc, info.absoluteResourcePath),
  };
}
