import chalk from 'chalk';
import { ArgvType } from '../../const';
import {
  BOOLEAN_OPTIONS,
  CONFIG_OPTIONS,
  SETUP_TEST_OPTION,
} from '../../enums/jestConfig';

const argvInvalidWarning = (field: string) => {
  const validArgv = chalk.bold(`--jest-${field}`);
  const invalidArgv = chalk.bold(`--${field}`);
  console.log(
    chalk.yellow(
      `Have an argument is invalid. Please use ${validArgv} instead of ${invalidArgv}.`,
    ),
  );
};

const parseJestArgv = (argv: ArgvType): string[] => {
  const args = ['--logHeapUsage'];

  const { _ } = argv;
  const [testDir] = _ || [null];

  if (testDir) {
    args.push(testDir);
  }

  BOOLEAN_OPTIONS.forEach((field: string) => {
    if (argv[field]) {
      argvInvalidWarning(field);
    }

    const option = `jest-${field}`;
    if (argv[option]) {
      args.push(`--${field}`);
    }
  });

  CONFIG_OPTIONS.forEach((field: string) => {
    if (argv[field]) {
      argvInvalidWarning(field);
    }

    const option = `jest-${field}`;
    if (argv[option]) {
      args.push(`--${field}=${argv[option]}`);
    }
  });

  const pathOfSetupTest = argv[SETUP_TEST_OPTION];
  if (pathOfSetupTest) {
    // TODO: do something great!
  }

  return args;
};

export default parseJestArgv;
