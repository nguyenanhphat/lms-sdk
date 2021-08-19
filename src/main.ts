import { Argv } from 'yargs';
import chalk from 'chalk';
import clearConsole from 'react-dev-utils/clearConsole';

import { CommandArgs } from './interfaces/args.interface';
import { findTask } from './utils/getTasksList';
import { TargetType, ModeType } from './const';
import applyConfigToPaths from './utils/applyConfigToPaths';
import { checkBuildScript } from './buildOnTemplates';
import checkAndClearCache from './utils/checkAndClearCache';
import checkAndPrintInfo from './utils/checkAndPrintInfo';
import dotenvExtend from './utils/dotenvExtend';
import exposeGarbageCollector from './utils/exposeGarbageCollector';
import { validateEnv } from './utils/validateEnv';

async function main(params: Argv<CommandArgs>): Promise<any> {
  process.env.BUILD_TIME = process.env.BUILD_TIME || Date.now().toString();

  exposeGarbageCollector();
  dotenvExtend(params);
  applyConfigToPaths();
  clearConsole();
  validateEnv();

  const isCleanCache: boolean = await checkAndClearCache(params);
  if (isCleanCache) {
    return true;
  }

  const isBuilded: boolean = await checkBuildScript(params);
  if (isBuilded) {
    return true;
  }

  const isPrinted: boolean = await checkAndPrintInfo(params);
  if (isPrinted) {
    return true;
  }

  const mode = (params.argv.mode || '').toString() as ModeType;
  const target = (params.argv.target || '').toString() as TargetType;
  if (!mode || !target) {
    console.log(chalk.red(`Missing mode or target params to run tool!`));
    process.exit(1);
  }

  const Task = findTask(target, mode);
  if (!Task) {
    console.log(
      chalk.red(
        `Not found Task for mode "${mode}" with target is "${target}".`,
      ),
    );
    process.exit(1);
  }

  const task = new Task(params.argv);

  try {
    await task.run();
  } catch (error) {
    console.error(
      chalk.red(
        'Have an error in process of Task. Please check error detail below!',
      ),
    );
    console.error(error);
    process.exit(1);
  }

  return true;
}

export default main;
