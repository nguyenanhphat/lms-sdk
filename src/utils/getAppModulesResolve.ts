import _get from 'lodash/get';
import _uniq from 'lodash/uniq';
import paths from '../paths';
import { getAppConfig } from './getAppConfig';
import getPackageJson from './getPackageJson';
import { AppModuleResolve } from '../const';
import memoizeFn from './memoizeFn';

export default memoizeFn(
  function getAppModulesResolve(): AppModuleResolve[] {
    const configFactory = getAppConfig();
    const appConfig = configFactory();
    const packageJson = getPackageJson();

    const pathOfNodeModules = ['node_modules', paths.nodeModules];
    const pathOfAppModules = [paths.appSrc];

    const pathOfCustomAppModules = packageJson.source
      ? [paths.resolveInAppPath(packageJson.source)]
      : [paths.appSrc];

    const pathOfExtendModules = _get(appConfig, 'modulesResolve') || [];

    return _uniq([
      ...pathOfNodeModules,
      ...pathOfAppModules,
      ...pathOfCustomAppModules,
      ...pathOfExtendModules,
    ]).filter(Boolean);
  },
);
