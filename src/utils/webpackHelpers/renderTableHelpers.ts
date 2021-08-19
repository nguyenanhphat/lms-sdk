import chalk from 'chalk';
import Consola from 'consola';
import textTable from 'text-table';

export const consola = Consola.withTag('webpackbar');

export function range(len: number) {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
}

export const colorize = (color: string) => {
  if (color[0] === '#') {
    return chalk.hex(color);
  }

  return chalk[color] || chalk.keyword(color);
};

function getBarChar(
  progress: number,
  color: string,
  i: number,
  length: number,
) {
  // tslint:disable-next-line:no-bitwise
  const w = ~~(progress * (length / 100));
  const colorFormat = i <= w ? colorize(color) : chalk.whiteBright;

  // if (i == 0) {
  //   return colorFormat('█');
  // }
  // if (i === w) {
  //   return colorFormat('█');
  // }
  // if (i === BAR_LENGTH - 1) {
  //   return colorFormat('█');
  // }
  // if (i < w) {
  //   return colorFormat('█');
  // }
  return colorFormat('▔');
}

export const renderBar = (progress, color, length) => {
  return range(length)
    .map((i) => getBarChar(progress, color, i, length))
    .join('');
};

export function createTable(data) {
  return textTable(data, {
    align: data[0].map(() => 'l'),
  }).replace(/\n/g, '\n\n');
}

export function ellipsis(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `${str.substr(0, n - 1)}...`;
}

export function ellipsisLeft(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `...${str.substr(str.length - n - 1)}`;
}
