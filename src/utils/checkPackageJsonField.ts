import fs from 'fs';
import os from 'os';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import { createQuestion } from './createQuestion';
import getPackageJson from './getPackageJson';
import paths from '../paths';
import { parse as parseJson } from './jsonHelpers';

export const checkPackageJsonField = async (
  field: string,
  defaultValue,
  isRequired: boolean = false,
  isInteractive: boolean = true,
) => {
  const pkgJson = getPackageJson();
  const isExisted = !!(pkgJson && pkgJson[field]);
  if (isExisted) {
    return true;
  }

  if (!defaultValue || !isInteractive) {
    throw new Error(
      chalk.red(`We're unable found "${field}" field in package.json`),
    );
  }

  const question: inquirer.Question = {
    type: 'confirm',
    name: `shouldSetValue:${field}`,
    message:
      chalk.yellow(`We're unable found "${field}" field in package.json`) +
      `\n\nWould you like to add the defaults to your ${chalk.bold(
        'package.json',
      )}?`,
    default: true,
  };

  const answer = await createQuestion(question);

  const isConfirmed = answer[question.name];
  if (!isConfirmed) {
    if (!isRequired) {
      return false;
    }

    throw new Error(
      chalk.red(
        `Please set "${field}" field in package.json before re-run agian!`,
      ),
    );
  }

  if (isConfirmed) {
    const pkg = parseJson(
      fs.readFileSync(paths.appPackageJson).toString(),
      false,
    );
    pkg[field] = defaultValue;
    fs.writeFileSync(
      paths.appPackageJson,
      JSON.stringify(pkg, null, 2) + os.EOL,
    );
  }

  return true;
};
