import _get from 'lodash/get';
import _uniq from 'lodash/uniq';
import { getAppConfig } from './getAppConfig';
import { AppModulesAlias } from '../const';
import memoizeFn from './memoizeFn';

export default memoizeFn(function getAppModulesAlias(): AppModulesAlias {
  const configFactory = getAppConfig();
  const appConfig = configFactory();
  const moduleAlias = _get(appConfig, 'modulesAlias') || {};
  return moduleAlias;
});
