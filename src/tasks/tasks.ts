import webpack from 'webpack';
import chalk from 'chalk';
import fs from 'fs';
import { CommandArgs } from '../interfaces/args.interface';
import { TargetType, ModeType, FactoryConfig } from '../const';
import { webpackConfigFactory } from '../utils/webpackConfigFactory';
import setNodeEnv from '../utils/setNodeEnv';
import getEnvConfig from '../utils/getEnvConfig';
import hashOf from '../utils/hashOf';
import { getBuildCacheDir } from '../utils/getCacheDirectory';
import paths from '../paths';
import { logEnvConfig, logEnvInfo } from '../utils/log';
import getPackageJson from '../utils/getPackageJson';

type ExtendTargetType = TargetType | 'service-worker';
type ExtendModeType = ModeType | 'test';

class Task {
  static readonly mode: ExtendModeType;
  static readonly target: ExtendTargetType;

  constructor(
    public readonly params: CommandArgs,
    public readonly target: ExtendTargetType,
    public readonly mode: ExtendModeType,
    public readonly factoryConfig: FactoryConfig,
  ) {}

  async checkAndPrintEnv() {
    const envConfig = getEnvConfig();
    if (!envConfig.nodeEnv) {
      throw new Error(
        'The NODE_ENV environment variable is required but was not specified.',
      );
    }

    await logEnvInfo();
    logEnvConfig();
  }

  async getWebpackConfig(): Promise<webpack.Configuration> {
    const webpackConfig = await webpackConfigFactory({
      ...this.factoryConfig,
      platform: this.params.platform,
    });

    return webpackConfig;
  }

  printConfigReport(webpackConfig: webpack.Configuration) {
    const envConfig = getEnvConfig();
    const {
      buildToolEnableCache: isEnableCache,
      buildToolCacheTimeout: cacheTimeout,
      buildToolCacheSizeThreshold: cacheSizeThreshold,
    } = envConfig;

    const entryId = hashOf(webpackConfig.entry, 8);
    const cacheEntryDir = getBuildCacheDir('source', entryId);

    console.log(
      [
        chalk[isEnableCache ? 'blue' : 'yellow'](
          `Cache for build is ${chalk.bold(
            isEnableCache ? 'enable' : 'disable',
          )}`,
        ),
        !isEnableCache &&
          chalk.yellow(`You should enable the cache to get the fastest speed!`),
        isEnableCache &&
          `Timeout: ${chalk.bold(
            cacheTimeout.toString(),
          )} (ms) - size threshold: ${chalk.bold(
            cacheSizeThreshold.toString(),
          )} (bytes)`,
        isEnableCache &&
          `Cache directory: ${chalk.bold(paths.resolveInToolCache(''))}`,
      ]
        .filter(Boolean)
        .join('\n'),
    );
    console.log();

    if (isEnableCache) {
      const isDirExisted = fs.existsSync(cacheEntryDir);
      console.log(
        chalk[isDirExisted ? 'blue' : 'yellow'](
          isDirExisted
            ? `Entry id ${chalk.bold(entryId)} is have the cache data`
            : `Entry id ${chalk.bold(entryId)} is NOT have the cache data`,
        ),
      );
      console.log();
    }

    return true;
  }

  printToolInfo() {
    const { log } = console;
    const appPkgJson = getPackageJson(paths.toolPackageJson);
    const { version } = appPkgJson;

    const isBetaVersion = /-beta.([0-9]+)/.test(version);
    const isRcVersion = /-rc.([0-9]+)/.test(version);
    const versionColor = isBetaVersion
      ? 'bgGreen'
      : (isRcVersion && 'bgCyan') || 'bgBlue';

    log();
    log(
      chalk.bgBlue.white.bold(' React SDK '.toUpperCase()),
      chalk[versionColor].white(` v${appPkgJson.version} `),
    );
    log();
  }

  // tslint:disable-next-line:no-empty
  async run(): Promise<any> {}

  async setup(): Promise<any> {
    setNodeEnv(this.factoryConfig.mode);
    this.printToolInfo();
    await this.checkAndPrintEnv();
  }

  // tslint:disable-next-line:no-empty
  async teardown(): Promise<any> {}
}

export default Task;
