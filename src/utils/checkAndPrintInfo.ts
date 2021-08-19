import chalk from 'chalk';
import { Argv } from 'yargs';
import { CommandArgs } from '../interfaces/args.interface';
import { logEnvInfo } from './log';

const checkAndPrintInfo = async (
  params: Argv<CommandArgs>,
): Promise<boolean> => {
  const { info } = params.argv;
  const isPrint = !!(info || false);
  if (!isPrint) {
    return false;
  }

  try {
    const extendPackagesList =
      typeof info === 'string'
        ? info
            .split(',')
            .filter(Boolean)
            .map(v => String(v).trim())
        : [];
    await logEnvInfo(extendPackagesList);
  } catch (error) {
    console.error(chalk.red(error));
    return true;
  }

  console.log(chalk.blue(`Printed environment info!`));
  return true;
};

export default checkAndPrintInfo;
