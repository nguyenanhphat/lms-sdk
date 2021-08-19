import Task from './tasks';
import { TargetType, PlatformType, TestFactoryConfig } from '../const';
import { TestCommandArgs, CommandArgs } from '../interfaces/args.interface';
import { runTest } from '../runners/test';
import coverageRepoter from '../runners/test/coverageReporter';
import runGarbageCollector from '../utils/runGarbageCollector';

const mode = 'test';

function configFactory(): TestFactoryConfig {
  return {
    bail: false,
    target: TargetType.web,
    mode,
    entry: [],
    globalVariable: {
      __SERVER__: false,
      __CLIENT__: true,
    },
  };
}

export class TestBrowserTask extends Task {
  static readonly mode = mode;
  static readonly target = TargetType.web;

  constructor(params: CommandArgs) {
    super(
      params,
      TestBrowserTask.target,
      TestBrowserTask.mode,
      configFactory(),
    );
  }

  async run(): Promise<any> {
    const { platform } = this.params as TestCommandArgs;

    const isTestAllPlatform = platform === 'all';
    const isHaveCoverage = this.params['jest-coverage'];

    const platforms = !isTestAllPlatform
      ? [platform]
      : [PlatformType.wap, PlatformType.web];

    for (const item of platforms) {
      await this.test(item);
      runGarbageCollector();
    }

    if (isHaveCoverage && isTestAllPlatform) {
      await coverageRepoter();
    }

    return true;
  }

  async test(platform: PlatformType): Promise<any> {
    const params = {
      ...this.params,
      platform,
    };

    await super.setup();
    await runTest(params);
    await super.teardown();
  }
}

export default TestBrowserTask;
