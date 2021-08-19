import chalk from 'chalk';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import _pickBy from 'lodash/pickBy';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import PrepackWebpackPlugin from 'prepack-webpack-plugin';
import * as webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import Webpackbar from 'webpackbar';
import { InjectManifest } from 'workbox-webpack-plugin';
import { FactoryConfig, ModeType, PlatformType, TargetType } from '../../const';
import paths from '../../paths';
import getGlobalVariable from '../../utils/getGlobalVariable';
import { checksumFileSync } from '../fsExtend';
import { getBuildCacheDir } from '../getCacheDirectory';
import getCommitHash from '../getCommitHash';
import getEnvConfig from '../getEnvConfig';
import getPackageJson from '../getPackageJson';
import hashOf from '../hashOf';
import CustomClassNameHandler from '../webpackPlugins/CustomClassNameHandler';
import SourceMapHandler from '../webpackPlugins/SourceMapHandler';
import WebpackReporter from './webpackReporter';

const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;

const getDefinePlugin = (globalVariable: FactoryConfig['globalVariable']) =>
  new webpack.DefinePlugin(getGlobalVariable(globalVariable));

const getIgnorePlugin = () =>
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/);

const getBuildProcessPlugin = (name: string) =>
  new Webpackbar({
    name,
    profile: true,
    reporters: [new WebpackReporter()],
  });

const getDuplicateDetectPlugin = () =>
  new DuplicatePackageCheckerPlugin({
    verbose: true,
    emitError: false,
    showHelp: true,
    strict: false,
    exclude(instance) {
      return false;
    },
  });

const getPluginsConfig = (
  factoryConfig: FactoryConfig,
  env: { [key: string]: any },
): webpack.Configuration['plugins'] => {
  const envConfig = getEnvConfig();
  const {
    publicUrl,
    buildTime,
    enableServiceWorker: isEnableServiceWorker,
    buildToolEnableCache: isEnableCache,
    buildToolCacheTimeout: cacheTimeout,
    buildToolCacheSizeThreshold: cacheSizeThreshold,
    buildToolEnableDetectDuplicatePackage: isDetectDuplicatePackage,
  } = envConfig;

  const commitHash = getCommitHash();
  const packageJson = getPackageJson();

  const isBuildForWeb = factoryConfig.target === TargetType.web;
  const isBuildForNode = factoryConfig.target === TargetType.node;

  const isProdMode = factoryConfig.mode === ModeType.production;
  const isDevMode = factoryConfig.mode === ModeType.development;

  const isBuildNodeProdMode = isBuildForNode && isProdMode;
  const isBuildWebProdMode = isBuildForWeb && isProdMode;
  const isBuildWebDevMode = isBuildForWeb && isDevMode;

  const templateParameters = {
    ...env,
    COMMIT_HASH: commitHash,
    PUBLIC_URL: publicUrl,
  };

  const htmlMinifyOptions = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  };

  const swFileName = `/sw-${factoryConfig.platform || 'web'}.${commitHash}.js`;

  const defineVariables = {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __MAJOR_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_TIME__: JSON.stringify(new Date(buildTime).toLocaleString()),
    __SERVICE_WORKER__: JSON.stringify(swFileName),
    __WEB__: factoryConfig.platform === PlatformType.web,
    __WAP__: factoryConfig.platform === PlatformType.wap,
    __PROD__: isProdMode,
    __DEBUG__: envConfig.buildToolEnableDebugJs,
    'process.env.PLATFORM': JSON.stringify(factoryConfig.platform),
    ...factoryConfig.globalVariable,
    ...env,
  };
  const definePlugin = getDefinePlugin(defineVariables);

  const ignorePlugin = getIgnorePlugin();
  const pluginsConfig = [
    definePlugin,
    ignorePlugin,
    isDetectDuplicatePackage && getDuplicateDetectPlugin(),
  ];

  if (isEnableCache) {
    const entryId = hashOf(factoryConfig.entry, 8);
    const cacheEntryDir = getBuildCacheDir('source', entryId);

    const yarnLockFilePath = paths.resolveInAppPath('yarn.lock');
    if (!yarnLockFilePath) {
      console.error(chalk.bold.red('Not found yarn.lock in your app'));
      process.exit(1);
    }

    const hashOfYarnLock = checksumFileSync(yarnLockFilePath);
    const excludeFields = ['__BUILD_TIME__'];
    const envRegexp = /^(STATIC_APP_|APP_|__)/i;
    const envFields = _pickBy(
      defineVariables,
      (value, key) => envRegexp.test(key) && !excludeFields.includes(key),
    );
    const hasOfEnv = hashOf(envFields);
    const environmentHash = hashOf([process.cwd(), hashOfYarnLock, hasOfEnv]);
    const cachePlugin = new HardSourceWebpackPlugin({
      environmentHash,
      info: {
        mode: 'none',
        level: 'none',
      },
      cacheDirectory: cacheEntryDir,
      configHash: (webpackConfig) => hashOf(webpackConfig),
      cachePrune: {
        maxAge: cacheTimeout,
        sizeThreshold: cacheSizeThreshold,
      },
    });
    pluginsConfig.push(cachePlugin);
  }

  const isCustomBuildMode = process.env.IS_CUSTOM_BUILD_MODE === '1';
  if (!isCustomBuildMode) {
    const buildProcessPlugin = getBuildProcessPlugin(packageJson.name);
    pluginsConfig.push(buildProcessPlugin);
  }

  if (isBuildWebDevMode) {
    const webDevPlugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.devHtml,
        minify: htmlMinifyOptions,
        chunksSortMode: 'none',
      }),
      new HotModuleReplacementPlugin(),
    ];
    pluginsConfig.push(...webDevPlugins);
  }

  if (isProdMode) {
    const allProdPlugins = [new webpack.optimize.ModuleConcatenationPlugin()];
    pluginsConfig.push(...allProdPlugins);
  }

  if (isBuildWebProdMode) {
    const webProdPlugins = [
      new HtmlWebpackPlugin({
        showErrors: true,
        inject: false,
        template: paths.templateSrc,
        chunksSortMode: 'none',
        minify: htmlMinifyOptions,
        filename: paths.templateFileName(commitHash),
        templateParameters,
      }),

      new HtmlWebpackPlugin({
        showErrors: true,
        inject: 'body',
        template: paths.pwaTemplateSrc,
        chunksSortMode: 'none',
        minify: htmlMinifyOptions,
        filename: paths.pwaTemplateFileName(commitHash),
        templateParameters,
      }),

      new HtmlWebpackPlugin({
        showErrors: true,
        inject: 'body',
        template: paths.pwaTemplateSrc,
        chunksSortMode: 'none',
        minify: htmlMinifyOptions,
        filename: paths.pwaTemplateFileName('static'),
        templateParameters,
      }),

      new HtmlWebpackPlugin({
        showErrors: true,
        inject: false,
        template: paths.manifestJsonSrc,
        templateParameters,
        chunksSortMode: 'none',
        minify: false,
        filename: paths.manifestJsonFileName(commitHash),
      }),

      new HtmlWebpackPlugin({
        showErrors: true,
        inject: false,
        template: paths.cacheManifestSrc,
        templateParameters,
        chunksSortMode: 'none',
        minify: false,
        filename: paths.cacheManifestFileName(commitHash),
      }),

      new HtmlWebpackPlugin({
        showErrors: true,
        inject: false,
        template: paths.fontFaceSrc,
        templateParameters,
        chunksSortMode: 'none',
        minify: htmlMinifyOptions,
        filename: paths.fontFaceFileName(commitHash),
      }),

      new MiniCssExtractPlugin({
        filename: 'static/css/[contenthash].css',
        chunkFilename: 'static/css/[contenthash].css',
      }),

      new ManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
    ];
    if (envConfig.buildToolEnablePrepackBrowser) {
      webProdPlugins.push(
        new PrepackWebpackPlugin({
          test: /\.js($|\?)/i,
          prepack: {
            compatibility: 'browser',
            trace: true,
            inlineExpressions: true,
          },
        }),
      );
    }
    if (isEnableServiceWorker) {
      const { swSrc, swDest } = factoryConfig.custom || {
        swSrc: null,
        swDest: null,
      };

      const swOptions = {
        swSrc: swSrc || paths.clientBuildFolder + '/service-worker.js',
        swDest:
          swDest ||
          paths.serviceworkerOutput(
            (factoryConfig.platform || 'web') as PlatformType,
            commitHash,
          ),
        precacheManifestFilename: 'static/precache.[manifestHash].js',
        include: [/\main/, /\app/],
        exclude: [/\.jpg$/, /\.svg$/, /\.png$/, /\.json$/, /\.sd$/],
        importsDirectory: 'static/lib/workbox',
        importWorkboxFrom: 'local',
      };

      webProdPlugins.push(new InjectManifest(swOptions));
    }

    pluginsConfig.push(...webProdPlugins);
  }

  if (isBuildNodeProdMode) {
    const nodeProdPlugins = [
      new MiniCssExtractPlugin({
        filename: 'tmp/[name].css',
      }),
    ];
    if (envConfig.buildToolEnablePrepackNode) {
      nodeProdPlugins.push(
        new PrepackWebpackPlugin({
          test: /\.js($|\?)/i,
          prepack: {
            compatibility: 'node-react',
            trace: true,
            inlineExpressions: true,
          },
        }),
      );
    }
    pluginsConfig.push(...nodeProdPlugins);
  }

  pluginsConfig.push(new CustomClassNameHandler(), new SourceMapHandler());

  return pluginsConfig.filter(Boolean) as webpack.Configuration['plugins'];
};

export default getPluginsConfig;
