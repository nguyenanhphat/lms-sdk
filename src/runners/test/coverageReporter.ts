import glob from 'glob';
import deepmerge from 'deepmerge';
import stringLength from 'string-length';
import paths from '../../paths';
import { CoverageSummary } from '../../const';
import chalk from 'chalk';

const getCoverageReports = (): CoverageSummary | null => {
  const coverageDir = paths.resolveInAppPath('coverage');
  const regexCoverageFiles = coverageDir + '/**/coverage-summary.json';
  const matchedCoverageFiles = glob.sync(regexCoverageFiles);
  if (matchedCoverageFiles.length === 0) {
    return null;
  }

  let report: CoverageSummary = {};
  matchedCoverageFiles.forEach((coverageFile: string) => {
    try {
      const coverageReport: CoverageSummary = require(coverageFile);
      report = deepmerge(report, coverageReport);
    } catch (error) {
      throw error;
    }
  });

  return report;
};

export const getValue = (value: number) => {
  const color = value >= 80 ? 'green' : (value >= 50 && 'yellow') || 'red';
  return chalk[color].bold(`${value}%`);
};

export const adjustToTerminalWidth = (label: string, value: number): string => {
  const columns = process.stdout.columns || 80;
  const WIDTH = columns - stringLength(getValue(value));
  const strs = label.match(new RegExp(`(.{1,${WIDTH}})`, 'g'));
  let lastString = strs[strs.length - 1];
  if (lastString.length < WIDTH) {
    lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'));
  }
  return strs
    .slice(0, -1)
    .concat(lastString)
    .join('\n');
};

const coverageRepoter = async (): Promise<any> => {
  const coverageReport = getCoverageReports();
  if (!coverageReport) {
    throw new Error('Not found coverage summary in app!');
  }

  const { total } = coverageReport;
  const { log } = console;

  log();
  log(chalk.white.bgBlue.bold('  Test coverage in app  '.toUpperCase()));
  const entries = Object.entries(total);
  entries.forEach(([key, value]) => {
    const { pct } = value;
    log(adjustToTerminalWidth(key, pct), getValue(pct));
  });
};

export default coverageRepoter;
