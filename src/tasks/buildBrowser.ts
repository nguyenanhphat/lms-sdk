import fs from 'fs';
import Worker from 'jest-worker';
import { CommandArgs } from '../interfaces/args.interface';
import Task from './tasks';
import { TargetType, ModeType, FactoryConfig, PlatformType } from '../const';
import paths from '../paths';
import {
  prepareBuild,
  runWebpackBuild,
  cleanupBuild,
} from '../runners/runWebpackBuild';
import getEnvConfig from '../utils/getEnvConfig';
import { createEmptyFile, checksumFile } from '../utils/fsExtend';
import { getDefinedInfoContent } from '../utils/buildServiceWorkerUtils';
import getCommitHash from '../utils/getCommitHash';

function configFactory(): FactoryConfig {
  return {
    bail: true,
    target: TargetType.web,
    mode: ModeType.production,

    entry: [paths.clientEntry],

    globalVariable: {
      __SERVER__: false,
      __CLIENT__: true,
    },
  };
}

export class BuildBrowserTask extends Task {
  static readonly mode = ModeType.production;
  static readonly target = TargetType.web;

  constructor(params: CommandArgs) {
    super(
      params,
      BuildBrowserTask.target,
      BuildBrowserTask.mode,
      configFactory(),
    );
  }

  async run() {
    await super.setup();
    const webpackConfig = await super.getWebpackConfig();
    this.printConfigReport(webpackConfig);

    const envConfig = getEnvConfig();
    const {
      enableServiceWorker: isEnableServiceWorker,
      buildToolEnableSourceMap: isEnableSourceMap,
    } = envConfig;

    const swFileSrc = paths.serviceworkerFolder + '/service-worker.js';
    const swEmptySrc = paths.clientBuildFolder + '/service-worker.js';

    await prepareBuild(webpackConfig);

    if (isEnableServiceWorker) {
      if (!fs.existsSync(swFileSrc)) {
        throw new Error('Not found Service worker source: ' + swFileSrc);
      }
      createEmptyFile(swEmptySrc);
    }

    await runWebpackBuild(webpackConfig);
    await cleanupBuild(webpackConfig);

    if (isEnableServiceWorker) {
      const { platform } = this.params;
      const hashOfSw = await checksumFile(swFileSrc);
      const commitHash = getCommitHash();
      const swPathDest = `/static/service-worker.${hashOfSw}.js`;
      const swContentDest = paths.clientBuildFolder + swPathDest;
      const swProdiverDest = paths.serviceworkerOutput(
        (platform || 'web') as PlatformType,
        commitHash,
      );
      const definedServiceWorkerContent = getDefinedInfoContent({
        __version: `"${commitHash}"`,
      });

      const fsWorker = new Worker(require.resolve('../utils/fsExtend'));
      const swUtilsWorker = new Worker(
        require.resolve('../utils/buildServiceWorkerUtils'),
      );

      const listHandlers = [
        (fsWorker as any).copyFile(swFileSrc, swContentDest), // copy service worker file to static folder
        (fsWorker as any).removeFile(swEmptySrc), // remove empty service worker file
        (swUtilsWorker as any).appendImportScripts(
          // append import scripts for provider dest file
          swProdiverDest,
          [swPathDest],
          definedServiceWorkerContent,
        ),
      ];

      // if (isEnableSourceMap) {
      //   listHandlers.push(
      //     (fsWorker as any).copyFile(
      //       swFileSrc + '.map',
      //       swContentDest + '.map',
      //     ), // copy source map of service worker to static folder
      //   );
      // }

      await Promise.all(listHandlers);

      fsWorker.end();
      swUtilsWorker.end();
    }

    await super.teardown();
  }
}

export default BuildBrowserTask;
