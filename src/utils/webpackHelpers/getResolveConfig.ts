import * as webpack from 'webpack';
import _uniq from 'lodash/uniq';
import paths from '../../paths';
import { TargetType } from '../../const';
import getPackageJson from '../getPackageJson';
import getAppModulesResolve from '../getAppModulesResolve';
import getAppModulesAlias from '../getAppModulesAlias';

/**
 * Get resolve for webpack config
 */
const getResolveConfig = (
  target: TargetType,
  moduleExtensions: string[],
): webpack.Configuration['resolve'] => {
  const appModulesResolve = getAppModulesResolve();
  const appModulesAlias = getAppModulesAlias();
  const packageJson = getPackageJson();

  const appSourcePath = packageJson.source
    ? paths.resolveInAppPath(packageJson.source)
    : paths.appSrc;

  const modulesAlias = {
    'react-native': 'react-native-web',
    lodash: 'lodash-es',
    [packageJson.name]: appSourcePath,
    ...appModulesAlias,
  };

  return {
    modules: appModulesResolve,
    extensions: moduleExtensions,
    alias: modulesAlias,
    mainFields:
      target === TargetType.node
        ? ['main', 'module']
        : ['browser', 'main', 'module'],
  };
};

export default getResolveConfig;
