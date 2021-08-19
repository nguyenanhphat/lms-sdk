import fs from 'fs';
import path from 'path';
import findCacheDir from 'find-cache-dir';
import { PlatformType, CommitHash } from './const';

// tslint:disable-next-line:no-var-requires
const packageJson = require('../package.json');

const toolPath = __dirname;
const toolPackageJson = path.resolve(toolPath, '../package.json');
const resolveInToolPath = (relativePath: string): string =>
  path.resolve(toolPath, relativePath);

const appPath = fs.realpathSync(process.cwd());

export const DEFAULT_CACHE_DIR_NAME = 'default';

const defaultToolCache = findCacheDir({
  name: packageJson.name,
  cwd: appPath,
  create: true,
  thunk: true,
});

const resolveInToolCache = (relativePath: string): string =>
  defaultToolCache(relativePath);

const resolveInAppPath = (relativePath: string): string =>
  path.resolve(appPath, relativePath);
const resolveInWorkspaceFolder = (src: string): string =>
  resolveInAppPath('../../' + src);

export default {
  toolPath,
  toolPackageJson,
  resolveInToolPath,
  resolveInToolCache,

  resolveInAppPath,
  resolveInWorkspaceFolder,
  appPath,
  appSrc: resolveInAppPath('src'),
  appPackageJson: resolveInAppPath('package.json'),
  appPublic: resolveInAppPath('public'),
  appBinary: resolveInAppPath('binary'),
  proxySetup: resolveInAppPath('src/server/apiProxy.js'),

  clientEntry: fs.existsSync(resolveInAppPath('src/client.ts'))
    ? resolveInAppPath('src/client.ts')
    : resolveInAppPath('src/client.js'),
  clientBuildFolder: resolveInAppPath('build/frontend'),

  serverEntry: fs.existsSync(resolveInAppPath('src/server.ts'))
    ? resolveInAppPath('src/server.ts')
    : resolveInAppPath('src/server.js'),
  serverBuildFolder: resolveInAppPath('build/backend'),

  serviceworkerEntry: fs.existsSync(resolveInAppPath('src/service-worker.ts'))
    ? resolveInAppPath('src/service-worker.ts')
    : resolveInAppPath('src/service-worker.js'),
  serviceworkerFolder: resolveInAppPath('build/service-worker'),
  serviceworkerOutput: (platform: PlatformType, commit: CommitHash) =>
    path.join(
      resolveInAppPath('build/frontend'),
      `sw-${platform}.${commit}.js`,
    ),

  eslintConfig: resolveInAppPath('.eslintrc'),

  workspaceNodeModules: fs.existsSync(resolveInWorkspaceFolder('node_modules'))
    ? resolveInWorkspaceFolder('node_modules')
    : undefined,
  nodeModules: fs.existsSync(resolveInAppPath('node_modules'))
    ? resolveInAppPath('node_modules')
    : undefined,
  appPackage: fs.existsSync(resolveInWorkspaceFolder('packages'))
    ? resolveInWorkspaceFolder('packages')
    : undefined,

  dotenv: resolveInAppPath('.env'),

  devHtml: resolveInAppPath('templates/dev.template'),

  statsJSON: resolveInAppPath('build/frontend/stats.json'),

  fontFaceSrc: resolveInAppPath('templates/fontface.template'),
  fontFaceFileName: (commit: CommitHash) => `fontface.${commit}.sd`,
  templateSrc: resolveInAppPath('templates/root.template'),
  templateFileName: (commit: CommitHash) => `template.${commit}.sd`,
  pwaTemplateSrc: resolveInAppPath('templates/pwa.template'),
  pwaTemplateFileName: (commit: CommitHash) => `static/pwa.${commit}.html`,
  manifestJsonSrc: resolveInAppPath('templates/manifest.template'),
  manifestJsonFileName: (commit: CommitHash) =>
    `static/manifest.${commit}.json`,
  cacheManifestSrc: resolveInAppPath('templates/cache.template'),
  cacheManifestFileName: (commit: CommitHash) => `static/cache.${commit}.json`,
};
