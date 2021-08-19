import Task from './tasks';
import paths from '../paths';
import { TargetType, ModeType, FactoryConfig } from '../const';
import { CommandArgs } from '../interfaces/args.interface';
import {
  prepareBuild,
  runWebpackBuild,
  cleanupBuild,
} from '../runners/runWebpackBuild';

function configFactory(): FactoryConfig {
  return {
    bail: true,
    target: TargetType.node,
    mode: ModeType.production,

    entry: [paths.serverEntry],

    globalVariable: {
      __SERVER__: true,
      __CLIENT__: false,
    },
  };
}

export class BuildNodeTask extends Task {
  static readonly mode = ModeType.production;
  static readonly target = TargetType.node;

  constructor(params: CommandArgs) {
    super(params, BuildNodeTask.target, BuildNodeTask.mode, configFactory());
  }

  async run() {
    await super.setup();
    const webpackConfig = await super.getWebpackConfig();
    this.printConfigReport(webpackConfig);

    await prepareBuild(webpackConfig);
    await runWebpackBuild(webpackConfig);
    await cleanupBuild(webpackConfig);

    await super.teardown();
  }
}

export default BuildNodeTask;
