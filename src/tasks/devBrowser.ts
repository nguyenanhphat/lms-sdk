import Task from './tasks';
import { TargetType, ModeType, FactoryConfig } from '../const';
import paths from '../paths';
import { CommandArgs } from '../interfaces/args.interface';
import { runWebpackDevServer } from '../runners/runWebpackDevServer';

function configFactory(): FactoryConfig {
  return {
    bail: false,
    target: TargetType.web,
    mode: ModeType.development,
    entry: [
      require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.clientEntry,
    ],
    globalVariable: {
      __SERVER__: false,
      __CLIENT__: true,
    },
  };
}

export class DevBrowserTask extends Task {
  static readonly mode = ModeType.development;
  static readonly target = TargetType.web;

  constructor(params: CommandArgs) {
    super(params, DevBrowserTask.target, DevBrowserTask.mode, configFactory());
  }

  async run() {
    await super.setup();

    const webpackConfig = await super.getWebpackConfig();
    await runWebpackDevServer({
      ...webpackConfig,
      watch: true,
      watchOptions: {
        aggregateTimeout: 500,
      },
    });

    await super.teardown();
  }
}

export default DevBrowserTask;
