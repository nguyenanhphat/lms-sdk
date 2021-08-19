import paths from '../paths';
import { getAppConfig } from './getAppConfig';

export default () => {
  if (!('__isAppliedConfig' in paths)) {
    const factoryConfig = getAppConfig();
    const appConfig = factoryConfig();
    if (appConfig && appConfig.paths) {
      Object.assign(paths, appConfig.paths);
    }

    Object.defineProperty(paths, '__isAppliedConfig', {
      value: true,
      enumerable: true,
    });
  }
};
