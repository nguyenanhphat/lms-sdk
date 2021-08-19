import _get from 'lodash/get';
import { getAppConfig } from '../../utils/getAppConfig';

interface ModuleMapper {
  [key: string]: string;
}

export function getSassModuleNameMapper(): ModuleMapper {
  const configFactory = getAppConfig();
  const appConfig = configFactory();
  const extendModuleNameMapper = _get(
    appConfig,
    'jestConfig.sassModuleNameMapper',
  );

  return {
    ...(extendModuleNameMapper || {}),
  };
}

export default function getModuleNameMapper(): ModuleMapper {
  const configFactory = getAppConfig();
  const appConfig = configFactory();
  const extendModuleNameMapper = _get(appConfig, 'jestConfig.moduleNameMapper');

  return {
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
    ...(extendModuleNameMapper || {}),
  };
}
