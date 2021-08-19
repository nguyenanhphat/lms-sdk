import { bullet, tick, cross, pointerSmall, radioOff } from 'figures';
import { ShallowWrapper, ReactWrapper } from 'enzyme';
import chalk from 'chalk';
import webpack from 'webpack';

export const BUILD_TARGET = 'web' || 'node' || 'service-worker';

export const SCRIPTS_FILE_EXTENSIONS = ['mjs', 'js', 'jsx'];
export const TYPESCRIPT_FILE_EXTENSIONS = ['ts', 'tsx'];
export const STYLE_FILE_EXTENSIONS = ['css', 'scss'];
export const JSON_FILE_EXTENSIONS = ['json'];
export const URL_FILE_EXTENSIONS = ['mock.json', 'jpg', 'jpge', 'png', 'svg'];
export const REACT_FILE_EXTENSIONS = ['icon.svg'];

export enum TargetType {
  web = 'web',
  node = 'node',
  sw = 'service-worker',
}

export enum ModeType {
  production = 'production',
  development = 'development',
}

export enum PlatformType {
  web = 'web',
  wap = 'wap',
}

export enum TestPlatformType {
  web = 'web',
  wap = 'wap',
  all = 'all',
}
export interface ArgvType {
  [key: string]: any;
}

export enum RunType {}

export const BAR_LENGTH = 50;
export const BLOCK_CHAR = '═';
export const BLOCK_CHAR2 = '═';
export const NEXT = ' ' + chalk.blue(pointerSmall) + ' ';
export const BULLET = bullet;
export const TICK = tick;
export const CROSS = cross;
export const CIRCLE_OPEN = radioOff;

export interface ModuleExtensionsType {
  json: string[];
  module: string[];
  script: string[];
  styles: string[];
  typescript: string[];
}

export interface TestRenderOptions {
  buildProps?: { [k: string]: any };
}

export enum TestRenderType {
  mount = 'mount',
  shallow = 'shallow',
  render = 'render',
}

export type EnzymeWrapper = ShallowWrapper | ReactWrapper;

export interface PackageJson {
  browserslist?: string | string[];
  cssbrowserslist?: string | string[];
  name: string;
  source?: string;
  version: string;
}

export interface WebpackConfigFactory {
  params: {
    platform: PlatformType;
    target: TargetType;
  };
}

export type AppConfigFactory = (params?: any) => AppConfig;

export interface AppConfig {
  buildScripts?: { [buildScript: string]: string[] };
  buildTemplates?: { [buildId: string]: BuildTemplate };
  importAlias?: ImportAlias[];
  jestConfig?: { [k: string]: any };
  modulesAlias?: AppModulesAlias;
  modulesResolve?: AppModuleResolve[];
  paths?: { [k: string]: any };
  schemaEnvironments?: SchemaEnvironments;
}

export type AppModuleResolve = string;

export interface AppModulesAlias {
  [prefix: string]: string;
}

export interface ImportAlias {
  camel2DashComponentName?: boolean;
  libraryDirectory?: string;
  libraryName: string;
  style?: boolean | string;
}

export interface BuildTemplate extends FactoryConfig {
  id?: string;
  output: {
    path: string | string[];
  };
  webpackConfig?: webpack.Configuration;
}

export type BuildTemplateId = [string, number] | string;

export interface FactoryConfig {
  bail?: boolean;
  custom?: {
    swDest?: string;
    swSrc?: string;
  };
  entry: string | string[] | webpack.Entry | webpack.EntryFunc;
  externalGlobalVariable?: string;
  externalModules?: string[];
  globalVariable?: { [x: string]: string | boolean };
  mode: ModeType;
  platform?: PlatformType;
  target: TargetType;
}

export interface BabelConfigFactory {
  mode: ModeType;
  target: TargetType;
}

export interface TestFactoryConfig extends FactoryConfig {
  mode: any;
}

export interface MemoizeWrapped {
  __cached?: Map<string, any>;
  flush: () => any;
}

export type MemoizeFn = (...rest: any[]) => any;

export interface EnvConfig {
  buildTime: number;
  buildToolCacheDirectory: string;
  buildToolCacheSizeThreshold: number;
  buildToolCacheTimeout: number;
  buildToolCssModuleLocalIdent: string | boolean;
  buildToolEnableBundleAnalyzer: boolean;
  buildToolEnableCache: boolean;
  buildToolEnableDebugCss: boolean;
  buildToolEnableDebugJs: boolean;
  buildToolEnableDetectDuplicatePackage: boolean;
  buildToolEnableLintCheck: boolean;
  buildToolEnableParallelCompile: boolean;
  buildToolEnablePrepackBrowser: boolean;
  buildToolEnablePrepackNode: boolean;
  buildToolEnablePrepackSW: boolean;
  buildToolEnableSourceMap: boolean;
  buildToolMaxAssetSize: number;
  buildToolMaxEntryPointSize: number;
  buildToolModuleIdHashDigest: string;
  buildToolModuleIdHashDigestLen: number;
  buildToolModuleIdHashFunc: string;
  buildToolShowWarning: boolean;
  buildToolWorkerParallelJobs: number;
  buildToolWorkerPoolTimeout: number;
  enableServiceWorker: boolean;
  nodeEnv: string;
  publicUrl: string;
}

export interface BabelModuleConfig {
  includeTypescript: boolean;
  isEnableCache: boolean;
  mode: ModeType;
  poolTimeout: number;
  target: TargetType;
  test: webpack.RuleSetCondition;
  workerParallelJobs: number;
}

export interface UseStyleLoaderConfig {
  cssbrowserslist?: any;
  isEnableSourceMap: boolean;
  isProduction: boolean;
  target: TargetType;
}

export interface StyleModuleConfig extends UseStyleLoaderConfig {
  cssOptions: { [key: string]: any };
  exclude?: webpack.RuleSetCondition;
  include?: webpack.RuleSetCondition;
  preProcessors?: webpack.Loader[];
  target: TargetType;
  test: webpack.RuleSetCondition;
}

/**
 * - "var" - Export by setting a variable: var Library = xxx (default)
 * - "this" - Export by setting a property of this: this["Library"] = xxx
 * - "commonjs" - Export by setting a property of exports: exports["Library"] = xxx
 * - "commonjs2" - Export by setting module.exports: module.exports = xxx
 * - "amd" - Export to AMD (optionally named)
 * - "umd" - Export to AMD, CommonJS2 or as property in root
 * - "window" - Assign to window
 * - "assign" - Assign to a global variable
 * - "jsonp" - Generate Webpack JSONP module
 */
export enum LibraryTarget {
  var = 'var',
  this = 'this',
  commonjs = 'commonjs',
  commonjs2 = 'commonjs2',
  amd = 'amd',
  umd = 'umd',
  window = 'window',
  assign = 'assign',
  jsonp = 'jsonp',
}

export enum SchemaEnvironmentType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  url = 'url',
  port = 'port',
}

export interface SchemaEnvironmentOptions {
  required: boolean;
}

export interface SchemaEnvironments {
  [environment: string]: [SchemaEnvironmentType, SchemaEnvironmentOptions?];
}

export interface DefinedServiceWorkerInfo {
  __version: string;
}

export interface CoverageSummary {
  [file: string]: {
    branches: CoveragePoint;
    functions: CoveragePoint;
    lines: CoveragePoint;
    statements: CoveragePoint;
  };
}

export interface CoveragePoint {
  covered: number;
  pct: number;
  skipped: number;
  total: number;
}

export interface ScriptLoaderConfig {
  isEnableCache: boolean;
  mode: ModeType;
  poolTimeout: number;
  target: TargetType;
  workerParallelJobs: number;
}

export interface StyleLoaderConfig {
  isEnableSourceMap: boolean;
  mode: ModeType;
  target: TargetType;
}

export interface SourceMapHandlerOptions {
  assetNameRegExp?: RegExp;
}

export interface OverrideGlobalVariables {
  [variable: string]: string | boolean;
}

export type CommitHash = string;
