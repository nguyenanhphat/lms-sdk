import chalk from 'chalk';
import { Argv } from 'yargs';
import { CommandArgs } from '../interfaces/args.interface';
import paths from '../paths';
import { removeFileSync } from './fsExtend';

const checkAndClearCache = async (
  params: Argv<CommandArgs>,
): Promise<boolean> => {
  const isCleanCache = !!(params.argv.clearCache || false);
  if (!isCleanCache) {
    return false;
  }

  const cacheDir = paths.resolveInToolCache('');
  removeFileSync(cacheDir);

  console.log(chalk.blue(`All cache data of app was cleared!`));
  return true;
};

export default checkAndClearCache;
