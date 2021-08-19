import chalk from 'chalk';
import { CommandArgs } from '../../interfaces/args.interface';
import { runJest } from './runJest';
import { buildSetupTest } from './buildSetupTest';

export async function runTest(params: CommandArgs) {
  try {
    await buildSetupTest(params);
  } catch (error) {
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  const result = await runJest(params);
  return result;
}
