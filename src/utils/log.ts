import chalk from 'chalk';
import envinfo from 'envinfo';
import _transform from 'lodash/transform';
import { trimmedString } from './trimmedString';

export function logTable(
  title: string,
  input: { [x: string]: any },
  prefix: string,
) {
  const borderLength = 69;
  const borderContent = new Array(borderLength).fill('=').join('');

  console.log('');
  console.log(borderContent);
  console.log(
    title
      .padStart(Math.round(borderLength / 2 + title.length / 2), ' ')
      .toUpperCase(),
  );
  console.log(borderContent);
  console.table(
    _transform(
      input,
      (result, value, key) => {
        result[
          trimmedString(key.replace(prefix, ''), 30).padEnd(30)
        ] = trimmedString(!value ? '[empty]' : value.toString(), 30).padEnd(30);
      },
      {},
    ),
  );
}

export function logEnvConfig() {
  const toolKey = 'Tool config';
  const toolRegex = /^BUILD_TOOL_/;
  const appKey = 'App config';
  const appRegex = /^APP_/;
  const otherKey = 'Other config';
  const otherRegex = /^(NODE_ENV|APP_DEFAULT_API_TIMEOUT|HOST|PORT|BACKLOG|PUBLIC_URL)/;

  const initTable = {
    [toolKey]: {},
    [appKey]: {},
    [otherKey]: {},
  };

  const env = process.env;
  const entriesOfEnv = Object.entries(env);

  const table = entriesOfEnv.reduce((acc, [key, value]) => {
    if (toolRegex.test(key)) {
      acc[toolKey][key] = value;
    } else if (appRegex.test(key)) {
      acc[appKey][key] = value;
    } else if (otherRegex.test(key)) {
      acc[otherKey][key] = value;
    }
    return acc;
  }, initTable);

  const entriesOfTable = Object.entries(table);
  entriesOfTable.forEach(([key, value]) => {
    const isEmpty = !value || Object.keys(value).length === 0;
    if (isEmpty) {
      return;
    }

    logTable(key, value, '');
    console.log();
  });
}

const spinerData = {
  interval: 1,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  frameIndex: 0,
  current: 0,
};

export class Spiner {
  log(str: string, length: number) {
    try {
      process.stdout.write(
        `\r ${trimmedString(str, length).padEnd(length)} \n${chalk.bold.white(
          `${
            spinerData.frames[spinerData.frameIndex]
          } Transpiling, please wait...`,
        )}`,
      );
      if (spinerData.current > spinerData.interval) {
        spinerData.current = 0;
        spinerData.frameIndex += 1;
        if (spinerData.frameIndex === spinerData.frames.length) {
          spinerData.frameIndex = 0;
        }
      }
      spinerData.current += 1;
    } catch (ex) {
      console.log(ex);
    }
  }
}

export const logEnvInfo = (packages?: string[]) =>
  envinfo.run(
    {
      System: ['OS', 'CPU', 'Memory'],
      Binaries: ['Node', 'Yarn', 'npm'],
      npmPackages: ['react', 'react-dom', 'react-redux', 'redux']
        .concat(packages || [])
        .filter(Boolean),
    },
    { console: true, showNotFound: true },
  );
