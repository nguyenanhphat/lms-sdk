import webpack from 'webpack';
import chalk from 'chalk';
import printBuildError from 'react-dev-utils/printBuildError';
import { saveBuildResult } from '../utils/saveBuildResult';
import { copySync, emptyDirSync } from '../utils/fsExtend';
import paths from '../paths';
import { runWebpackCompiler } from './runWebpackCompiler';
import { checkPackageJsonField } from '../utils/checkPackageJsonField';
import { BROWSERLIST } from '../enums/packageJson';
import { TargetType } from '../const';

function copyPublicFolder() {
  copySync(paths.appPublic, paths.clientBuildFolder, {
    dereference: true,
  });
}

function copyBinaryFolder() {
  copySync(paths.appBinary, paths.resolveInAppPath('build'), {
    dereference: true,
  });
}

export const prepareBuild = async (
  webpackConfig: webpack.Configuration,
): Promise<any> => {
  const isInteractive = process.stdout.isTTY;

  await checkPackageJsonField('browserslist', BROWSERLIST, true, isInteractive);

  const buildFolder = webpackConfig.output.path;
  emptyDirSync(buildFolder);

  if (webpackConfig.target === TargetType.web) {
    copyPublicFolder();
  }
  if (webpackConfig.target === TargetType.node) {
    copyBinaryFolder();
  }
};

// tslint:disable-next-line:no-empty
export const cleanupBuild = async (webpackConfig): Promise<any> => {};

export async function runWebpackBuild(
  webpackConfig: webpack.Configuration,
): Promise<any> {
  try {
    const { warnings, stats } = await runWebpackCompiler(webpackConfig);
    if (warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(warnings.join('\n\n'));
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.',
      );
      console.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n',
      );
    }

    if (webpackConfig.target === 'web') {
      saveBuildResult(stats);
    }

    return { warnings, stats };
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
}

export const buildFullProcess = async (
  webpackConfig: webpack.Configuration,
): Promise<any> => {
  await prepareBuild(webpackConfig);
  await runWebpackBuild(webpackConfig);
  await cleanupBuild(webpackConfig);
};

export default buildFullProcess;
