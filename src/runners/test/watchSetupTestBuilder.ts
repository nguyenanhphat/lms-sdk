import chalk from 'chalk';
import buildSetupTest from './buildSetupTest';
import { CommandArgs } from '../../interfaces/args.interface';

export const ENUMS = {
  KEY_REBUILD_SETUP_TEST: 's',
};

class WatchSetupTestBuilder {
  getUsageInfo() {
    return {
      key: ENUMS.KEY_REBUILD_SETUP_TEST,
      prompt: 're-build setup test',
    };
  }

  async run(globalConfig, updateConfigAndRun: () => void) {
    const argv: CommandArgs = require('yargs').argv;
    console.log(chalk.blue('Waiting to re-build setup test...'));
    await buildSetupTest(argv);
    console.log(chalk.blue('Start running the tests again!'));
    return updateConfigAndRun();
  }
}

module.exports = WatchSetupTestBuilder;
