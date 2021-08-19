import Task from './tasks';
import paths from '../paths';
import { ModeType, TargetType, FactoryConfig } from '../const';
import { CommandArgs } from '../interfaces/args.interface';
import buildFullProcess from '../runners/runWebpackBuild';

function configFactory(): FactoryConfig {
  return {
    bail: true,
    target: TargetType.sw,
    mode: ModeType.production,

    entry: [paths.serviceworkerEntry],

    globalVariable: {
      __SERVER__: false,
      __CLIENT__: false,
    },
  };
}

export class BuildServiceWorkerTask extends Task {
  static readonly mode = ModeType.production;
  static readonly target = TargetType.sw;

  constructor(params: CommandArgs) {
    super(
      params,
      BuildServiceWorkerTask.target,
      BuildServiceWorkerTask.mode,
      configFactory(),
    );
  }

  async run() {
    await super.setup();
    const webpackConfig = await super.getWebpackConfig();
    this.printConfigReport(webpackConfig);
    await buildFullProcess(webpackConfig);
    await super.teardown();
  }
}

export default BuildServiceWorkerTask;
